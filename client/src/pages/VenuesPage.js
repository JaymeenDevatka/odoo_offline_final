import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VenueCard from "../components/VenueCard";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Fade,
  Stack,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DomainIcon from "@mui/icons-material/Domain";

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    sportType: "",
    maxPrice: "",
    venueType: "",
    minRating: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, ...filters });
      const response = await axios.get(
        `http://localhost:5000/api/venues?${params.toString()}`
      );
      if (response.data && Array.isArray(response.data.venues)) {
        setVenues(response.data.venues);
        setTotalPages(response.data.totalPages);
      } else {
        setVenues([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      setVenues([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVenues();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchVenues]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Find Your <span style={{ color: "#1976d2" }}>Court</span>
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Explore and book the best sports venues around you.
        </Typography>

        {/* Filter Bar */}
        <Paper
          elevation={6}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.7)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Search..."
                variant="outlined"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>
                  <SportsSoccerIcon fontSize="small" sx={{ mr: 1 }} /> Sport
                  Type
                </InputLabel>
                <Select
                  name="sportType"
                  value={filters.sportType}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  <MenuItem value="Badminton">Badminton</MenuItem>
                  <MenuItem value="Football">Football</MenuItem>
                  <MenuItem value="Tennis">Tennis</MenuItem>
                  <MenuItem value="Cricket">Cricket</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>
                  <DomainIcon fontSize="small" sx={{ mr: 1 }} /> Venue Type
                </InputLabel>
                <Select
                  name="venueType"
                  value={filters.venueType}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  <MenuItem value="Indoor">Indoor</MenuItem>
                  <MenuItem value="Outdoor">Outdoor</MenuItem>
                  <MenuItem value="Mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> Max
                  Price/hr
                </InputLabel>
                <Select
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  <MenuItem value="300">Up to ₹300</MenuItem>
                  <MenuItem value="500">Up to ₹500</MenuItem>
                  <MenuItem value="1000">Up to ₹1000</MenuItem>
                  <MenuItem value="1500">Up to ₹1500</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>
                  <StarIcon fontSize="small" sx={{ mr: 1 }} /> Min Rating
                </InputLabel>
                <Select
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">
                    <em>Any</em>
                  </MenuItem>
                  <MenuItem value="4">4+ Stars</MenuItem>
                  <MenuItem value="3">3+ Stars</MenuItem>
                  <MenuItem value="2">2+ Stars</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Venue List */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress size={50} />
          </Box>
        ) : venues.length === 0 ? (
          <Box textAlign="center" mt={8}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076501.png"
              alt="No results"
              width="120"
              style={{ opacity: 0.8 }}
            />
            <Typography variant="h6" mt={2}>
              No venues found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your filters and search again.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {(venues || []).map((venue, index) => (
              <Grid item key={venue.id} xs={12} sm={6} md={4}>
                <Fade in timeout={300 + index * 100}>
                  <Box>
                    <VenueCard venue={venue} />
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
            />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default VenuesPage;
