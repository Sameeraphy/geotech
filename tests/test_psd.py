from as1726_geotech import psd


def test_interpolate_d():
    sizes = [4.0, 2.0, 1.0, 0.5, 0.25, 0.125]
    retained = [0, 0, 20, 30, 30, 20]
    sizes_sorted, percent = psd.percent_passing_from_retained(sizes, retained)
    # Confirm computed percent passing matches expected pattern
    assert percent == [100.0, 100.0, 100.0, 80.0, 50.0, 20.0]

    # D50 should be exactly 0.25 for this synthetic distribution
    D50 = psd.interpolate_d(sizes_sorted, percent, 50.0)
    assert D50 == 0.25

    # D60 should be approx 0.315 (within tolerance)
    D60 = psd.interpolate_d(sizes_sorted, percent, 60.0)
    assert D60 is not None
    assert abs(D60 - 0.3147) < 0.01
