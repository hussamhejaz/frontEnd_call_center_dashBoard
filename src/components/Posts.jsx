/* eslint-disable jsx-a11y/img-redundant-alt */
// src/components/Posts.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TablePagination,
  Avatar,
  ImageList,
  ImageListItem,
  Stack, // Import Stack
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const Posts = () => {
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Helper function to determine media type
  const getMediaType = (url) => {
    if (!url) return 'unknown';
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const extension = pathname.split('.').pop().toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
      
      if (imageExtensions.includes(extension)) {
        console.log(`Media Type: Image (${extension})`);
        return 'image';
      }
      if (videoExtensions.includes(extension)) {
        console.log(`Media Type: Video (${extension})`);
        return 'video';
      }
      console.log(`Media Type: Unknown (${extension})`);
      return 'unknown';
    } catch (e) {
      console.error('Invalid URL:', url);
      return 'unknown';
    }
  };

  // Fetch posts from backend and transform VideoUrls to arrays
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://backend-call-center-2.onrender.com/posts'); // Adjust the URL as needed
      const data = response.data;

      // Transform VideoUrls and ImageUrls from objects to arrays
      const transformedPosts = Object.keys(data).reduce((acc, key) => {
        const post = data[key];
        acc[key] = {
          ...post,
          VideoUrls: post.VideoUrls ? Object.values(post.VideoUrls) : [],
          ImageUrls: post.ImageUrls ? Object.values(post.ImageUrls) : [],
        };
        return acc;
      }, {});

      setPosts(transformedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
      setLoading(false);
    }
  };

  // Initial fetch and set up polling
  useEffect(() => {
    fetchPosts(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchPosts();
    }, 5000); // Poll every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleOpenDialog = (postId, type) => {
    setSelectedPost(postId);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPost(null);
    setActionType('');
    setOpenDialog(false);
  };

  const handleStatusChange = async () => {
    if (!selectedPost || !actionType) return;

    setActionLoading(true);
    try {
      const status = actionType === 'accept' ? 1 : 2;
      await axios.patch(`https://backend-call-center-2.onrender.com/posts/${selectedPost}/status`, { status });

      // Update the local state to reflect the change
      setPosts((prevPosts) => ({
        ...prevPosts,
        [selectedPost]: { ...prevPosts[selectedPost], Status: status },
      }));

      setSuccessMessage(`Post has been ${actionType === 'accept' ? 'accepted' : 'rejected'} successfully.`);
    } catch (error) {
      console.error('Error updating post status:', error);
      setError('Failed to update post status. Please try again.');
    } finally {
      setActionLoading(false);
      handleCloseDialog();
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case '0':
      case 0:
        return <Chip label="Under Process" color="warning" />;
      case '1':
      case 1:
        return <Chip label="Accepted" color="success" icon={<CheckCircle />} />;
      case '2':
      case 2:
        return <Chip label="Rejected" color="error" icon={<Cancel />} />;
      default:
        return <Chip label="Unknown" />;
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and search posts
  const filteredPosts = Object.entries(posts).filter(([id, post]) => {
    const matchesSearch = post.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || Number(post.Status) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const displayedPosts = filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleOpenMediaDialog = (mediaUrl) => {
    console.log('Opening media dialog for:', mediaUrl);
    setPreviewImage(mediaUrl); // Ensure this is the original media URL without resizing parameters
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setPreviewImage('');
    setOpenImageDialog(false);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: '30px', marginBottom: '30px' }}>
      <Typography variant="h4" gutterBottom>
        Manage Posts
      </Typography>

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search Description"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Status Filter</InputLabel>
            <Select
              label="Status Filter"
              value={filterStatus}
              onChange={(e) => {
                const value = e.target.value;
                setFilterStatus(value === 'all' ? 'all' : Number(value));
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value={0}>Under Process</MenuItem>
              <MenuItem value={1}>Accepted</MenuItem>
              <MenuItem value={2}>Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Posts Table */}
      {filteredPosts.length === 0 ? (
        <Typography variant="h6">No posts match your search/filter criteria.</Typography>
      ) : (
        <Paper>
          <TableContainer component={Paper} sx={{ maxHeight: 600, overflowX: 'auto' }}>
            <Table aria-label="posts table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Profile</strong></TableCell>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Media</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPosts.map(([id, post]) => (
                  <TableRow key={id} hover>
                    <TableCell>
                      <Avatar alt={post.Username} src={post.ProfileImageUrl} />
                    </TableCell>
                    <TableCell>{post.Username}</TableCell>
                    <TableCell>{post.Description}</TableCell>
                    <TableCell>
                      {(post.ImageUrls && post.ImageUrls.length > 0) || (post.VideoUrls && post.VideoUrls.length > 0) ? (
                        <ImageList cols={3} rowHeight={100} gap={8}>
                          {/* Render Images */}
                          {post.ImageUrls && post.ImageUrls.map((url, index) => (
                            <ImageListItem
                              key={`image-${index}`}
                              sx={{
                                cursor: 'pointer',
                                '&:hover img, &:hover video': { opacity: 0.8 },
                                borderRadius: '8px',
                                overflow: 'hidden',
                                width: '100%',
                                height: '100%',
                              }}
                              onClick={() => handleOpenMediaDialog(url)}
                            >
                              <img
                                src={`${url}?w=150&h=150&fit=crop&auto=format`}
                                srcSet={`${url}?w=150&h=150&fit=crop&auto=format&dpr=2 2x`}
                                alt={`Media ${index + 1} of post by ${post.Username}`}
                                loading="lazy"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'opacity 0.3s ease',
                                }}
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop if fallback fails
                                  e.target.src = '/path-to-fallback-image.jpg'; // Replace with your fallback image path
                                }}
                              />
                            </ImageListItem>
                          ))}

                          {/* Render Videos */}
                          {post.VideoUrls && post.VideoUrls.map((url, index) => (
                            <ImageListItem
                              key={`video-${index}`}
                              sx={{
                                cursor: 'pointer',
                                '&:hover img, &:hover video': { opacity: 0.8 },
                                borderRadius: '8px',
                                overflow: 'hidden',
                                width: '100%',
                                height: '100%',
                              }}
                              onClick={() => handleOpenMediaDialog(url)}
                            >
                              <video
                                src={`${url}`}
                                controls
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'opacity 0.3s ease',
                                }}
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop if fallback fails
                                  e.target.src = '/path-to-fallback-video.mp4'; // Replace with your fallback video path
                                }}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </ImageListItem>
                          ))}
                        </ImageList>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No media available
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{getStatusChip(post.Status)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        {post.Status !== 1 && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleOpenDialog(id, 'accept')}
                          >
                            Accept
                          </Button>
                        )}
                        {post.Status !== 2 && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleOpenDialog(id, 'reject')}
                          >
                            Reject
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredPosts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">
          {actionType === 'accept' ? 'Accept Post' : 'Reject Post'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            color={actionType === 'accept' ? 'success' : 'error'}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              actionType === 'accept' ? 'Accept' : 'Reject'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Preview Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        aria-labelledby="media-preview-dialog-title"
        maxWidth="lg" // Larger size for better media display
        fullWidth
      >
        <DialogTitle id="media-preview-dialog-title">Media Preview</DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0, // Remove default padding
          }}
        >
          {getMediaType(previewImage) === 'video' ? (
            <video
              src={previewImage}
              controls
              style={{
                maxWidth: '100%',
                maxHeight: '80vh', // Prevent the media from exceeding viewport height
                objectFit: 'contain', // Maintain aspect ratio without cropping
                borderRadius: '8px',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path-to-fallback-video.mp4'; // Replace with your fallback video path
              }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={previewImage}
              alt="Media Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh', // Prevent the image from exceeding viewport height
                objectFit: 'contain', // Maintain aspect ratio without cropping
                borderRadius: '8px',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path-to-fallback-image.jpg'; // Replace with your fallback image path
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Posts;
