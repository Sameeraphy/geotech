"""Simple SPT (Standard Penetration Test) helpers."""

class SPTTest:
    """Placeholder container for SPT test results."""

    def __init__(self, depths=None, n_values=None):
        self.depths = depths or []
        self.n_values = n_values or []

    def add(self, depth, n):
        self.depths.append(depth)
        self.n_values.append(n)
