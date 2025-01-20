import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import config from "../../../config/config";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); // To track which announcement is being edited
  const adminData = JSON.parse(localStorage.getItem("adminData"));
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    created_by: adminData.id || "",
  });

  // Fetch announcements
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

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      await axios.delete(`${config.API_URL}/announcements/${id}`);
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== id)
      );
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("Failed to delete the announcement");
    }
  };

  // Open dialog for creating or editing announcement
  const handleOpen = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setNewAnnouncement({
        title: announcement.title,
        description: announcement.description,
      });
    } else {
      setEditingAnnouncement(null);
      setNewAnnouncement({
        title: "",
        description: "",
      });
    }
    setOpen(true);
  };

  // Close dialog and reset form
  const handleClose = () => {
    setOpen(false);
    setNewAnnouncement({ title: "", description: "" });
    setEditingAnnouncement(null);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async () => {
    if (editingAnnouncement) {
      const announcementData = {
        title: newAnnouncement.title,
        description: newAnnouncement.description,
      };

      try {
        // This is the fixed part: response variable is not needed if not used
        await axios.put(
          `${config.API_URL}/announcements/${editingAnnouncement.id}`,
          announcementData
        );
        setAnnouncements((prev) =>
          prev.map((announcement) =>
            announcement.id === editingAnnouncement.id
              ? { ...announcement, ...announcementData }
              : announcement
          )
        );
        handleClose();
      } catch (err) {
        console.error("Error updating announcement:", err);
        alert("Failed to update the announcement");
      }
    } else {
      const announcementData = {
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        created_by: adminData.id,
      };

      try {
        const response = await axios.post(
          `${config.API_URL}/announcements`,
          announcementData
        );
        // If you want to use the response, you can log it or check the structure
        setAnnouncements((prev) => [...prev, response.data.announcement]);
        handleClose();
      } catch (err) {
        console.error("Error adding announcement:", err);
        alert("Failed to add the announcement");
      }
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Announcements
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ marginBottom: "16px" }}
      >
        Add New Announcement
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell>{announcement.title}</TableCell>
                  <TableCell>{announcement.description}</TableCell>
                  <TableCell>
                    {new Date(announcement.created_at).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpen(announcement)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      style={{ marginLeft: "8px" }}
                      onClick={() => handleDelete(announcement.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={newAnnouncement.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={newAnnouncement.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Announcement;
