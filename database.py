"""Compatibility shim.

Some deployment/start commands import `database` as a top-level module.
In this project the real implementation lives in `backend.database`.

This file re-exports the public symbols so both import styles work:
- `from backend.database import ...`
- `from database import ...`
"""

from backend.database import engine, Base, get_db  # re-export

