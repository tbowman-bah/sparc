import pytest
from sparc_cli.tools.memory import (
    _global_memory,
    get_memory_value,
    get_related_files,
    get_work_log,
    reset_work_log,
    emit_key_facts,
    delete_key_facts,
    emit_key_snippets,
    delete_key_snippets,
    emit_research_notes,
    emit_related_files,
    deregister_related_files,
    emit_task,
    delete_tasks,
    emit_plan,
    task_completed,
    plan_implementation_completed,
    one_shot_completed
)
from pathlib import Path

def setup_function():
    """Reset global memory before each test."""
    _global_memory.clear()

def test_get_memory_value():
    """Test get_memory_value retrieves values with default."""
    _global_memory['test'] = 'value'
    assert get_memory_value('test') == 'value'
    assert get_memory_value('nonexistent') == ''

def test_get_related_files():
    """Test get_related_files returns list of files."""
    _global_memory['related_files'] = {'1': 'file1.txt', '2': 'file2.txt'}
    files = get_related_files()
    assert isinstance(files, list)
    assert len(files) == 2
    assert 'file1.txt' in files

def test_work_log():
    """Test work log operations."""
    _global_memory['work_log'] = ['task1', 'task2']
    assert get_work_log() == ['task1', 'task2']
    reset_work_log()
    assert get_work_log() == []

def test_key_facts():
    """Test key facts operations."""
    result = emit_key_facts(facts="test facts")
    assert result["success"] is True
    assert _global_memory.get('key_facts') == "test facts"
    
    result = delete_key_facts()
    assert result["success"] is True
    assert 'key_facts' not in _global_memory

def test_key_snippets():
    """Test key snippets operations."""
    result = emit_key_snippets(snippets="test snippets")
    assert result["success"] is True
    assert _global_memory.get('key_snippets') == "test snippets"
    
    result = delete_key_snippets()
    assert result["success"] is True
    assert 'key_snippets' not in _global_memory

def test_research_notes():
    """Test research notes operations."""
    result = emit_research_notes(notes="test notes")
    assert result["success"] is True
    assert _global_memory.get('research_notes') == "test notes"

def test_related_files():
    """Test related files operations."""
    result = emit_related_files(filepath="test.txt", description="test file")
    assert result["success"] is True
    assert len(_global_memory.get('related_files', {})) == 1
    
    result = deregister_related_files(filepath="test.txt")
    assert result["success"] is True
    assert len(_global_memory.get('related_files', {})) == 0

def test_tasks():
    """Test task operations."""
    result = emit_task(task="test task")
    assert result["success"] is True
    assert len(_global_memory.get('tasks', {})) == 1
    
    result = delete_tasks()
    assert result["success"] is True
    assert len(_global_memory.get('tasks', {})) == 0

def test_plan():
    """Test plan operations."""
    result = emit_plan(plan="test plan")
    assert result["success"] is True
    assert _global_memory.get('plan') == "test plan"

def test_completion_flags():
    """Test completion flag operations."""
    result = task_completed()
    assert result["success"] is True
    assert _global_memory.get('task_completed') is True
    
    result = plan_implementation_completed()
    assert result["success"] is True
    assert _global_memory.get('plan_completed') is True
    
    result = one_shot_completed()
    assert result["success"] is True
    assert _global_memory.get('one_shot_completed') is True
