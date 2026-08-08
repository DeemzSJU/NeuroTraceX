"""add user_id to participants

Revision ID: a1b2c3d4e5f6
Revises: 030f011a9a95
Create Date: 2026-08-03 15:25:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '030f011a9a95'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('participants', sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index(op.f('ix_participants_user_id'), 'participants', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_participants_user_id'), table_name='participants')
    op.drop_column('participants', 'user_id')
