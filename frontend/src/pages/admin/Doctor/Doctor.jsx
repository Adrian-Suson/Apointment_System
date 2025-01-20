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
import defaulAvatar from "../../../assets/Profile.jpg";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch data from the /doctors endpoint using axios
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/doctors`);
        setDoctors(response.data); // Set the fetched doctors data to state
      } catch (err) {
        console.error(
          "Error fetching doctors:",
          err.response ? err.response.data.msg : err.message
        );
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array means this effect runs once after component mounts

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Doctors
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
              <TableCell>Specialization</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.id}</TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>
                  <img
                    src={`${config.API_URL}/profile_pictures/${doctor.avatar}` || defaulAvatar}
                    alt="avatar"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                    }}
                  />
                </TableCell>
                <TableCell>{doctor.birthdate}</TableCell>
                <TableCell>{doctor.address}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.phone_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Doctor;
