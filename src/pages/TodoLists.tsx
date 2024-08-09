import { Table } from "antd";
import { useQuery } from '@tanstack/react-query';


export interface TodoList {
  id: string;
  title: string;
}



export function TodoLists() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
  ];

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const dataSource = data as TodoList[];

  return (
    <div>
      <h1>TodoList</h1>
      <Table dataSource={dataSource} columns={columns} />
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