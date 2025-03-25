import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useSearchParams } from "react-router-dom";

type Movie = {
  name: string;
  rating: number;
  genre: string;
  year: number;
};

const MovieTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  /*
  TYPICAL AUTHENTICATION FLOW:
  The login endpoint will return a JWT token based on the provided username and password.
  This token will be stored in the context.
  The context will include an `authenticate` function that:
  1. Passes the JWT token to validate the user's authentication.
  2. Redirects the user to the login page if they are not authenticated.
  */
  const onAuth = async () => {
    try {
      // Generate a request token
      const tokenResponse = await fetch(
        `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`
      );
      if (!tokenResponse.ok) {
        throw new Error(
          `Error generating request token: ${tokenResponse.statusText}`
        );
      }
      const tokenData = await tokenResponse.json();
      const requestToken = tokenData.request_token;
      setAuthToken(requestToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  /*
  TYPICAL DATA FETCHING FLOW:
  1. Check token exist, handle error if not.
  2. Try/ Catch fetch data from the API using the token.
  3. Handle response errors.
  4. Format the data as needed.
  5. Set the data in the state. 
  */
  useEffect(() => {
    const fetchMovies = async () => {
      if (!authToken) {
        console.error("No auth token available. Please authenticate first.");
        return;
      }

      try {
        // Limit is not supported in this api, normally it would be supported
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Error fetching movies: ${response.statusText}`);
        }

        const movieData = await response.json();
        const formattedMovies = movieData.results.map((movie: any) => ({
          name: movie.title,
          rating: movie.vote_average,
          genre: movie.genre_ids.join(", "),
          year: new Date(movie.release_date).getFullYear(),
        }));

        setMovies(formattedMovies);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, [page, limit, authToken]);

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={onAuth}>
        Authenticate (fetches request token for api calls)
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Movies</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Rating&nbsp;(g)</TableCell>
              <TableCell align="right">Genre&nbsp;(g)</TableCell>
              <TableCell align="right">Year&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right">{row.genre}</TableCell>
                <TableCell align="right">{row.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1} // Disable if on the first page
        >
          Prev
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ margin: "0px 12px 0px 12px" }}
          onClick={() => handlePageChange(page + 1)}
          disabled={movies.length < limit} // Disable if no more movies
        >
          Next
        </Button>
      </TableContainer>
    </Box>
  );
};
