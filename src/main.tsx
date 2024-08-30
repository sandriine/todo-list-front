import './main.css';
import { TodoLists } from './pages/TodoLists.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

export function Main() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TodoLists />
      </QueryClientProvider>
    </>
  );
}
