"""Main launcher GUI for as1726_geotech tools."""

import tkinter as tk
from tkinter import ttk

from .gui import main as launch_psd_gui


class MainLauncherGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("AS1726 Geotech Tools")
        self.root.geometry("520x360")

        self._build_ui()

    def _build_ui(self):
        # Header
        header_frame = ttk.Frame(self.root, padding=15)
        header_frame.pack(fill="x")

        title = ttk.Label(header_frame, text="as1726_geotech", font=("Segoe UI", 20, "bold"))
        title.pack(anchor="center")

        subtitle = ttk.Label(header_frame, text="Geotechnical Site Investigation Tools", font=("Segoe UI", 11))
        subtitle.pack(anchor="center", pady=(5, 0))

        # Buttons
        buttons_frame = ttk.LabelFrame(self.root, text="Available Tools", padding=15)
        buttons_frame.pack(fill="both", expand=True, padx=15, pady=10)

        ttk.Button(buttons_frame, text="PSD Tool", command=self.open_psd_tool, width=30).pack(pady=8)
        ttk.Button(buttons_frame, text="SPT Tool (coming soon)", command=self._show_not_ready, width=30).pack(pady=8)
        ttk.Button(buttons_frame, text="CPT Tool (coming soon)", command=self._show_not_ready, width=30).pack(pady=8)
        ttk.Button(buttons_frame, text="MC Tool (coming soon)", command=self._show_not_ready, width=30).pack(pady=8)

        self.status_label = ttk.Label(self.root, text="Select a tool to begin.", foreground="gray")
        self.status_label.pack(anchor="w", padx=15, pady=(0, 10))

    def open_psd_tool(self):
        self.status_label.config(text="Opening PSD tool...")
        self.root.destroy()
        launch_psd_gui()

    def _show_not_ready(self):
        self.status_label.config(text="This tool is not yet available.")


def main():
    root = tk.Tk()
    app = MainLauncherGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
