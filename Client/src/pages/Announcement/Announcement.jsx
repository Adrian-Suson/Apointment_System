import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/config";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch announcements when component mounts
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/announcements`);
        setAnnouncements(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements");
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <CircularProgress />
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Loading announcements...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="sm"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "50px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Announcements
      </Typography>
      <Paper style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
        <List>
          {announcements.length === 0 ? (
            <ListItem>
              <ListItemText primary="No announcements available." />
            </ListItem>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{announcement.title}</Typography>
                    }
                    secondary={
                      <Typography variant="body1">
                        {announcement.description}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default Announcement;
