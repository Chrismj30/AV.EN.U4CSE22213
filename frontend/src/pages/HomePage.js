import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, Card, CardContent, Grid, Button,
  Paper
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';

/**
 * Home page component for the Stock Price Aggregation application
 */
const HomePage = () => {
  const navigate = useNavigate();
  
  // Features to display on the homepage
  const features = [
    {
      title: 'Real-time Stock Prices',
      description: 'View up-to-date stock prices with interactive charts that show price trends over time.',
      icon: <ShowChartIcon fontSize="large" color="primary" />,
      link: '/stock'
    },
    {
      title: 'Stock Correlation Analysis',
      description: 'Analyze how different stocks move in relation to each other using our correlation heatmap.',
      icon: <TimelineIcon fontSize="large" color="primary" />,
      link: '/correlation'
    }
  ];
  
  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: 6,
          mb: 4,
          backgroundImage: 'linear-gradient(120deg, #e0f7fa 0%, #bbdefb 100%)',
          borderRadius: 2
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Stock Price Aggregation
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" gutterBottom>
          Real-time stock price visualization and analysis
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: 800, mb: 4 }}>
          Welcome to our platform that simplifies stock market data analysis. 
          Track price movements, visualize trends, and analyze correlations between 
          different stocks all in one place.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/stock')}
          startIcon={<ShowChartIcon />}
        >
          Get Started
        </Button>
      </Paper>
      
      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Features
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                },
                transition: 'box-shadow 0.3s ease-in-out'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  {feature.title}
                </Typography>
                <Typography variant="body1" paragraph align="center">
                  {feature.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate(feature.link)}
                  >
                    Explore
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* How It Works Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        How It Works
      </Typography>
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Real-time Stock Data
            </Typography>
            <Typography variant="body1" paragraph>
              Our application pulls real-time stock data from reliable financial APIs. 
              You can select specific stocks and time intervals to view price trends 
              and patterns as they develop.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Correlation Analysis
            </Typography>
            <Typography variant="body1" paragraph>
              We calculate and visualize correlations between different stocks, helping 
              you understand how they move in relation to each other. This can be valuable 
              for diversification and portfolio management strategies.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default HomePage; 