from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from app.core.config import settings

# Database URL
DATABASE_URL = f"mysql+mysqlconnector://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DATABASE}"

# Create engine
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


class Conversation(Base):
    """对话表 - 存储用户与知识馆长的对话历史"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)  # 会话 ID，用于区分不同用户/会话
    user_query = Column(Text, nullable=False)  # 用户问题
    agent_answer = Column(Text, nullable=False)  # AI 回答
    context_entities = Column(Text, default="")  # 上下文实体，逗号分隔
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关联的追问选项
    follow_ups = relationship("FollowUpQuestion", back_populates="conversation", cascade="all, delete-orphan")


class FollowUpQuestion(Base):
    """追问建议表 - 存储为用户生成的追问选项"""
    __tablename__ = "follow_up_questions"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    question_text = Column(Text, nullable=False)  # 追问文本
    sort_order = Column(Integer, default=0)  # 排序顺序

    # 反向关联
    conversation = relationship("Conversation", back_populates="follow_ups")


def init_db():
    """初始化数据库，创建所有表"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """获取数据库会话"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
