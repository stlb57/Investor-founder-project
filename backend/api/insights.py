from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from db.database import get_db
from models.models import Story, StoryType

router = APIRouter()

@router.get("/")
async def get_all_stories(
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all data-driven stories"""
    query = db.query(Story)
    if type:
        query = query.filter(Story.type == type)
    
    stories = query.order_by(Story.created_at.desc()).all()
    
    results = []
    for s in stories:
        results.append({
            "id": s.id,
            "slug": s.slug,
            "title": s.title,
            "type": s.type.value,
            "summary": s.summary,
            "related_tags": json.loads(s.related_tags) if s.related_tags else [],
            "created_at": s.created_at
        })
    return results

@router.get("/{slug}")
async def get_story_detail(
    slug: str,
    db: Session = Depends(get_db)
):
    """Get detail for a specific story"""
    story = db.query(Story).filter(Story.slug == slug).first()
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
        
    return {
        "id": story.id,
        "slug": story.slug,
        "title": story.title,
        "type": story.type.value,
        "summary": story.summary,
        "content": json.loads(story.content),
        "related_tags": json.loads(story.related_tags) if story.related_tags else [],
        "created_at": story.created_at
    }
