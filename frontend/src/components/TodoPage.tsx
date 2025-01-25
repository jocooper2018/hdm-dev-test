import { Check, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [ tasks, setTasks ] = useState<Task[]>([]);
  const [ taskEdits, setTaskEdits ] = useState<{ [id: number]: string, }>({});

  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    await handleFetchTasks();
  };

  const handleSave = async (id: number) => {
    const taskName = taskEdits[id]?.trim();

    if (taskName && taskName !== tasks.find((task) => task.id === id)?.name) {
      await api.patch(`/tasks/${id}`, { name: taskName });
      await handleFetchTasks();
    }
  };

  const handleEditChange = (id: number, value: string) => {
    setTaskEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleCreate = async () => {
    await api.post('/tasks', { name: 'Nouvelle Tâche' });
    await handleFetchTasks();
  };

  useEffect(() => {
    (async () => {
      await handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box justifyContent="center" mt={5} flexDirection="column">
        {
          tasks.map((task) => (
            <Box
              key={task.id}
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
              gap={1}
              width="100%"
            >
              <TextField
                size="small"
                value={taskEdits[task.id] ?? task.name}
                fullWidth
                sx={{ maxWidth: 350 }}
                onChange={(e) => handleEditChange(task.id, e.target.value)}
              />
              <Box>
                <IconButton
                  color="success"
                  disabled={!(taskEdits[task.id]?.trim() && taskEdits[task.id]?.trim() !== task.name)}
                  onClick={() => handleSave(task.id)}
                >
                  <Check />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Button variant="outlined" onClick={() => handleCreate()}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TodoPage;
