import as1726_geotech as ag
from as1726_geotech import mc, psd, spt


def test_version():
    assert isinstance(ag.__version__, str) and ag.__version__


def test_mc():
    assert mc.moisture_content(110, 100) == 10.0


def test_psd_basic():
    sizes = [4.0, 2.0, 1.0, 0.5, 0.25, 0.125]
    retained = [0, 0, 20, 30, 30, 20]
    res = psd.compute_gradation(sizes, retained=retained)
    assert len(res["percent_passing"]) == len(sizes)
    assert res["D30"] is not None and res["D30"] > 0


def test_spt_class():
    s = spt.SPTTest()
    s.add(1.0, 10)
    assert s.depths == [1.0] and s.n_values == [10]
