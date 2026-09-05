"""CPT (Cone Penetration Test) utilities placeholder."""

class CPTTest:
    """Minimal placeholder for CPT results."""

    def __init__(self, depths=None, qc=None, fs=None):
        self.depths = depths or []
        self.qc = qc or []
        self.fs = fs or []

    def add(self, depth, qc_value, fs_value=None):
        self.depths.append(depth)
        self.qc.append(qc_value)
        self.fs.append(fs_value)
