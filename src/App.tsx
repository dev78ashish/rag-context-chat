import axios from 'axios';
import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import useSession from './store/session';

const App: React.FC = () => {

  const {  sessionToken,setSessionToken } = useSession();

  useEffect(() => {console.log('sessionToken', sessionToken)}, [sessionToken]);

  useEffect(() => {
    const callHelloApi = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
        const response = await axios.get(
          `${apiBaseUrl}/create-session`
        );

        console.log(response.data)
        setSessionToken(response.data.sessionToken);
      } catch (e) {
        console.log("Error calling the api: ", e);
      }
    }

    callHelloApi();
  }, [setSessionToken])

  return (
    <AppRoutes />
  );
};

export default App;