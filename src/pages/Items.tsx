import { List } from "antd";
import {useQuery} from "@tanstack/react-query";

export interface Item {
  id: string;
  content: string;
  todo_list_id: string;
  checked: boolean;
}

export function Items({todo_list_id}: {todo_list_id: string}) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['items', todo_list_id],
    queryFn: fetchItems,
  });

  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: { error.message }</span>
  }

  return (
    <div>
      <h1>Items</h1>
      <List
          bordered
          dataSource={data}
          renderItem={(item: Item) => (
              <List.Item>
                <List.Item.Meta title={ item.content }/>
              </List.Item>
          )}
      />
    </div>
  )
}

const fetchItems = async (id: any) => {
    const response = await fetch(`http://localhost:3000/todos/${id}/items`)
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return response.json()
}