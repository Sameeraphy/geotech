"""Moisture content and related utilities."""

def moisture_content(wet_mass, dry_mass):
    """Return moisture content as percent: (wet - dry) / dry * 100.

    Raises ValueError if dry_mass is zero.
    """
    if dry_mass == 0:
        raise ValueError("dry_mass must be non-zero")
    return (wet_mass - dry_mass) / dry_mass * 100.0
