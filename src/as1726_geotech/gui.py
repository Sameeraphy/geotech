"""Simple GUI for PSD analysis and plotting."""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
from . import psd


class PSDAnalyzerGUI:
    """Tkinter GUI for PSD analysis."""

    def __init__(self, root):
        self.root = root
        self.root.title("AS1726 PSD Analyzer")
        self.root.geometry("700x600")

        # Title
        title_label = ttk.Label(root, text="Particle Size Distribution Analyzer", font=("Arial", 14, "bold"))
        title_label.pack(pady=10)

        # Input frame
        input_frame = ttk.LabelFrame(root, text="Input Data", padding=10)
        input_frame.pack(fill="both", expand=True, padx=10, pady=5)

        # Sieve sizes
        ttk.Label(input_frame, text="Sieve Sizes (mm, comma-separated):").pack(anchor="w")
        self.sieve_entry = ttk.Entry(input_frame, width=60)
        self.sieve_entry.insert(0, "4.0, 2.0, 1.0, 0.5, 0.25, 0.125, 0.063")
        self.sieve_entry.pack(anchor="w", pady=5)

        # Retained/Percent frame
        data_frame = ttk.Frame(input_frame)
        data_frame.pack(fill="x", pady=5)

        ttk.Label(data_frame, text="Retained Masses (g):").pack(side="left", padx=5)
        self.retained_entry = ttk.Entry(data_frame, width=30)
        self.retained_entry.insert(0, "0, 5, 20, 35, 25, 10, 5")
        self.retained_entry.pack(side="left", padx=5)

        # Buttons frame
        button_frame = ttk.Frame(input_frame)
        button_frame.pack(fill="x", pady=10)

        ttk.Button(button_frame, text="Load Excel", command=self.load_excel).pack(side="left", padx=5)
        ttk.Button(button_frame, text="Compute & Plot", command=self.plot_psd).pack(side="left", padx=5)
        ttk.Button(button_frame, text="Export Data", command=self.export_data).pack(side="left", padx=5)
        ttk.Button(button_frame, text="Clear", command=self.clear_data).pack(side="left", padx=5)

        # Output frame
        output_frame = ttk.LabelFrame(root, text="Gradation Results", padding=10)
        output_frame.pack(fill="both", expand=True, padx=10, pady=5)

        self.result_text = tk.Text(output_frame, height=15, width=80, font=("Courier", 10))
        self.result_text.pack(fill="both", expand=True)

        scrollbar = ttk.Scrollbar(output_frame, orient="vertical", command=self.result_text.yview)
        scrollbar.pack(side="right", fill="y")
        self.result_text.config(yscrollcommand=scrollbar.set)

        self.last_result = None

    def load_excel(self):
        """Load PSD data from Excel file."""
        file_path = filedialog.askopenfilename(
            filetypes=[("Excel files", "*.xlsx *.xls"), ("All files", "*.*")]
        )
        if not file_path:
            return

        try:
            data = psd.load_from_excel(file_path)
            sieves = data["sieves"]
            retained = data["retained"]

            # Update input fields
            self.sieve_entry.delete(0, "end")
            self.sieve_entry.insert(0, ", ".join(f"{s:.3f}" for s in sieves))

            self.retained_entry.delete(0, "end")
            self.retained_entry.insert(0, ", ".join(f"{r:.1f}" for r in retained))

            messagebox.showinfo("Success", f"Loaded {len(sieves)} sieve data points from Excel")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load Excel: {e}")

    def plot_psd(self):
        """Parse input, compute PSD, and plot."""
        try:
            # Parse sieve sizes
            sieve_str = self.sieve_entry.get()
            sieves = [float(x.strip()) for x in sieve_str.split(",")]

            # Parse retained masses
            retained_str = self.retained_entry.get()
            retained = [float(x.strip()) for x in retained_str.split(",")]

            if len(sieves) != len(retained):
                messagebox.showerror("Error", "Sieve sizes and retained masses must have same count")
                return

            # Compute gradation
            result = psd.compute_gradation(sieves, retained=retained)
            self.last_result = result

            # Display results
            self.result_text.delete("1.0", "end")
            output = "=" * 70 + "\n"
            output += "GRADATION ANALYSIS RESULTS\n"
            output += "=" * 70 + "\n\n"

            output += "Percent Passing:\n"
            output += "-" * 70 + "\n"
            for sz, pp in zip(result["sizes"], result["percent_passing"]):
                output += f"  Sieve {sz:7.3f} mm: {pp:6.1f}% passing\n"

            output += "\n" + "-" * 70 + "\n"
            output += "Gradation Statistics:\n"
            output += "-" * 70 + "\n"
            if result["D10"]:
                output += f"  D10 (10% finer):  {result['D10']:8.4f} mm\n"
            if result["D30"]:
                output += f"  D30 (30% finer):  {result['D30']:8.4f} mm\n"
            if result["D60"]:
                output += f"  D60 (60% finer):  {result['D60']:8.4f} mm\n"
            if result["Cu"]:
                output += f"  Cu (Uniformity):  {result['Cu']:8.2f}\n"
            if result["Cc"]:
                output += f"  Cc (Curvature):   {result['Cc']:8.2f}\n"

            output += "\n" + "=" * 70 + "\n"
            self.result_text.insert("1.0", output)

            # Plot
            psd.plot_gradation(result["sizes"], result["percent_passing"], title="Particle Size Distribution")

        except ValueError as e:
            messagebox.showerror("Input Error", f"Invalid input: {e}")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")

    def export_data(self):
        """Export results to JSON."""
        if self.last_result is None:
            messagebox.showwarning("No Data", "Compute PSD first")
            return

        file_path = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON", "*.json")])
        if file_path:
            try:
                with open(file_path, "w") as f:
                    json.dump(self.last_result, f, indent=2)
                messagebox.showinfo("Success", f"Data saved to {file_path}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save: {e}")

    def clear_data(self):
        """Clear input fields and results."""
        self.sieve_entry.delete(0, "end")
        self.retained_entry.delete(0, "end")
        self.result_text.delete("1.0", "end")
        self.last_result = None


def main():
    """Launch the GUI."""
    root = tk.Tk()
    app = PSDAnalyzerGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
