"""Demo script for PSD module usage."""

from as1726_geotech import psd
import json

# Example: typical soil sieve analysis
# Sieves (mm) and retained masses (g)
sieve_sizes = [4.0, 2.0, 1.0, 0.5, 0.25, 0.125, 0.063]
retained_masses = [0, 5, 20, 35, 25, 10, 5]

print("=" * 70)
print("PARTICLE SIZE DISTRIBUTION (PSD) EXAMPLE")
print("=" * 70)
print(f"\nInput Sieves (mm): {sieve_sizes}")
print(f"Retained Masses (g): {retained_masses}")

# Compute gradation
result = psd.compute_gradation(sieve_sizes, retained=retained_masses)

print("\n" + "-" * 70)
print("Computed Percent Passing:")
print("-" * 70)
for sz, pp in zip(result["sizes"], result["percent_passing"]):
    print(f"  Sieve {sz:6.3f} mm: {pp:6.1f}% passing")

print("\n" + "-" * 70)
print("Gradation Statistics:")
print("-" * 70)
print(f"  D10 (10% finer):  {result['D10']:.4f} mm" if result['D10'] else "  D10: Not computed")
print(f"  D30 (30% finer):  {result['D30']:.4f} mm" if result['D30'] else "  D30: Not computed")
print(f"  D60 (60% finer):  {result['D60']:.4f} mm" if result['D60'] else "  D60: Not computed")
print(f"  Cu (Uniformity):  {result['Cu']:.2f}" if result['Cu'] else "  Cu: Not computed")
print(f"  Cc (Curvature):   {result['Cc']:.2f}" if result['Cc'] else "  Cc: Not computed")

# Example 2: Direct percent passing input
print("\n" + "=" * 70)
print("Example 2: Direct Percent Passing Input")
print("=" * 70)

sieves_2 = [10, 4, 2, 0.75, 0.425, 0.2, 0.075]
percent_passing_2 = [100, 95, 82, 70, 58, 40, 15]

print(f"\nInput Sieves (mm): {sieves_2}")
print(f"Percent Passing:   {percent_passing_2}")

result_2 = psd.compute_gradation(sieves_2, percent_passing=percent_passing_2)

print("\nGradation Statistics:")
print(f"  D10: {result_2['D10']:.4f} mm" if result_2['D10'] else "  D10: Not computed")
print(f"  D30: {result_2['D30']:.4f} mm" if result_2['D30'] else "  D30: Not computed")
print(f"  D60: {result_2['D60']:.4f} mm" if result_2['D60'] else "  D60: Not computed")
print(f"  Cu:  {result_2['Cu']:.2f}" if result_2['Cu'] else "  Cu: Not computed")
print(f"  Cc:  {result_2['Cc']:.2f}" if result_2['Cc'] else "  Cc: Not computed")

print("\n" + "=" * 70)
