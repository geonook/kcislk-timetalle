import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import HomePage from '../pages/HomePage';
import StudentPage from '../pages/StudentPage';
import ClassPage from '../pages/ClassPage';
import ExamProctorPage from '../pages/ExamProctorPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/classes" replace />,
      },
      {
        path: 'classes',
        element: <HomePage />,
      },
      {
        path: 'students',
        element: <StudentPage />,
      },
      {
        path: 'class/:className',
        element: <ClassPage />,
      },
      {
        path: 'exam-proctor',
        element: <ExamProctorPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;