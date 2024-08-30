import { List } from 'antd';
import { useQuery } from '@tanstack/react-query';
import {Items} from "./Items.tsx";
import {useState} from "react";


export interface TodoList {
  id: string;
  title: string;
}

export function TodoLists() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  });

  const [todoListId, setTodoListId] = useState('');


  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: { error.message }</span>
  }

  function mapToDataSource() : TodoList[] {
    return data.map((item: TodoList) => (
      {
        ...item, key: item.id
      }
    ));
  }

  function displayItems(id: string)  {
    setTodoListId(id);
  }

  return (
    <div>
      <h1>TodoList</h1>
      <List
          bordered
          dataSource={mapToDataSource()}
          renderItem={(todo: TodoList) => (
              <List.Item onClick={() => displayItems(todo.id)}>
                <List.Item.Meta title={ todo.title }/>
              </List.Item>
          )}
      />
      {todoListId !== '' ? <Items todo_list_id={todoListId} /> : null}
    </div>
  )
}

const fetchTodoList = async () => {
  const response = await fetch('http://localhost:3000/todos')
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}