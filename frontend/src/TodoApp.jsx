import  { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const [editId, setEditId] = useState(null);

  const handleSubmit = async () => {
    if (!title || !desc) return;
    const newTodo = { title, desc };

    if (editId) {
      await fetch(`http://localhost:8000/todos/${editId}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify(newTodo)
      });

      const updatedTodos = todos.map(todo => {
        if (todo._id === editId) {
          return { ...todo, title, desc };
        }
        return todo;
      });

      setTodos(updatedTodos);
      setEditId(null);
      setTitle('');
      setDesc('');
    }else{
      const data = await fetch(`http://localhost:8000/todos`, {
        method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        body: JSON.stringify(newTodo)
      });
  
      const resTodo = await data.json();
  
      setTodos([...todos, resTodo]);
      setTitle('');
      setDesc('');
    }
  
    }
    
  const getItems = async () => {
    const fetchData = await fetch(`http://localhost:8000/todos`, {
      method: "GET"
    });
    const data = await fetchData.json();

    setTodos(data);
  };

  useEffect(() => {
    getItems();
  }, []);

  const handleDeleteTodo = async (id) => {
    await fetch(`http://localhost:8000/todos/${id}`, {
      method: "Delete"
    });
    const updatedTodo = todos.filter((item) => item._id !== id);
    setTodos(updatedTodo);
  };

  const handleEditTodo = (id) => {
    const todo = todos.find(todo => todo._id === id);
    setTitle(todo.title);
    setDesc(todo.desc);
    setEditId(id);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1>Todo App</h1>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h2>Todo List</h2>
          <ListGroup>
            {todos.map((todo, index) => (
              <ListGroup.Item key={index} className=" d-flex justify-content-between">
                <div>
                  <strong>{todo.title}</strong>: {todo.desc}
                </div>
                <div>
                  <Button
                    // variant="danger"
                    className="ml-2"
                    onClick={() => handleEditTodo(todo._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="ml-2"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoApp;
