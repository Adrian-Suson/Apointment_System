import { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import config from "../../../config/config";
import defaultAvatar from "../../../assets/Profile.jpg";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the /users endpoint using axios
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/users`); // Make GET request with axios
        setUsers(response.data); // Set the fetched users data to state
      } catch (err) {
        console.error(
          "Error fetching users:",
          err.response ? err.response.data.msg : err.message
        );
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once after component mounts

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Birthdate</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const profile = user.avatar
                ? `${config.API_URL}/profile_pictures/${user.avatar}`
                : defaultAvatar; // Construct profile image URL inside the loop

              return (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <img
                      src={profile}
                      alt="avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.birthday}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
