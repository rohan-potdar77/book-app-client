import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { deleteRequest, getRequest, putRequest } from "./components/api";
import { DELETE_BOOK, GET_BOOKS, UPDATE_BOOK } from "./components/server";

const App = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    formState: { errors },
    reset,
  } = useForm();

  const getData = () => {
    getRequest(GET_BOOKS)
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching book data:", error);
        setLoading(false);
      });
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleDelete = (bookId) => {
    deleteRequest(DELETE_BOOK + "/" + bookId)
      .then((response) => {
        alert(response.data);
        const newList = books.filter((book) => book._id !== bookId);
        setBooks(newList);
      })
      .catch((error) => console.error(error));
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleChangeEdit = (e) => {
    setSelectedBook((preBook) => ({
      ...preBook,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSave = () => {
    putRequest(UPDATE_BOOK + "/" + selectedBook._id, "", selectedBook, "")
      .then((response) => {
        alert(response.data);
        reset({ title: "", author: "", genre: "" });
        setDialogOpen(false);
        getData();
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Container maxWidth="md" sx={{ paddingTop: 5 }}>
        <Button
          size="small"
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate("/add-book")}
        >
          Add Book
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Title
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Author
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Genre
                </TableCell>

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body1">Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="body1">No books available</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book._id}>
                    <TableCell align="center">{book.title}</TableCell>
                    <TableCell align="center">{book.author}</TableCell>
                    <TableCell align="center">{book.genre}</TableCell>
                    <TableCell align="center">
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleEdit(book)}
                          >
                            Edit
                          </Button>
                        </Grid>

                        <Grid item>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleDelete(book._id)}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={handleClose}>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogContent>
            {selectedBook && (
              <>
                <TextField
                  required
                  size="small"
                  name="title"
                  label="Title"
                  variant="outlined"
                  {...register("title", {
                    required: true,
                    pattern: /^[A-Za-z\s]+$/i,
                  })}
                  value={selectedBook.title}
                  margin="normal"
                  onChange={handleChangeEdit}
                  error={!!errors.genre}
                  helperText={errors.genre ? "Please enter a valid genre" : ""}
                />
                <br></br>
                <TextField
                  required
                  size="small"
                  name="author"
                  label="Author"
                  variant="outlined"
                  {...register("author", {
                    required: true,
                    pattern: /^[A-Za-z\s]+$/i,
                  })}
                  value={selectedBook.author}
                  margin="normal"
                  onChange={handleChangeEdit}
                  error={!!errors.author}
                  helperText={
                    errors.author ? "Please enter a valid author name" : ""
                  }
                />
                <br></br>
                <TextField
                  required
                  size="small"
                  name="genre"
                  label="Genre"
                  variant="outlined"
                  {...register("genre", {
                    required: true,
                    pattern: /^[A-Za-z\s]+$/i,
                  })}
                  value={selectedBook.genre}
                  margin="normal"
                  onChange={handleChangeEdit}
                  error={!!errors.genre}
                  helperText={errors.genre ? "Please enter a valid genre" : ""}
                />
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button size="small" variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="small" variant="outlined" onClick={handleEditSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default App;
