import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import axios from "axios";

const App = () => {
  const [searchText, setSearchText] = useState("");
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError("Please enter some text to search.");
      return;
    }
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:3000/parseFile/search?text=${searchText}`
      );
      setDocuments(response.data.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Error fetching documents. Please try again.");
    }
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Document Search
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <TextField
          label="Enter text to search"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          sx={{ width: "20%", mb: 1, mr: 4 }}
          error={!!error}
          helperText={error}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ width: "10%" }}
        >
          Search
        </Button>
      </Box>

      <Box
        sx={{
          mt: 5,
          px: 10,
        }}
      >
        {documents.length > 0 && (
          <Typography variant="h6" sx={{ mb: 3 }}>
            Search Results:
          </Typography>
        )}

        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                  {doc.id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Last updated: {new Date(doc.updatedAt).toLocaleString()}
                </Typography>
                <Link
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  underline="hover"
                  sx={{
                    fontWeight: "bold",
                    display: "inline-block",
                    py: 1,
                    px: 2,
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: "5px",
                  }}
                >
                  View Document
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {documents.length === 0 && !error && (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mt: 5, textAlign: "center" }}
          >
            No results found. Try searching for something else.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default App;