import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Product } from '../../types';

interface ProductViewProps {
  product: Product;
  onEdit: () => void;
}

const ProductView = ({ product, onEdit }: ProductViewProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={3}>
        <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>
          {product.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onEdit}
          sx={{ ml: { sm: 2 }, width: { xs: '100%', sm: 'auto' } }}
        >
          Edit Product
        </Button>
      </Box>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}> 
            <Typography variant="h6" gutterBottom>Details</Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {product.description}
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>Category:</strong> {product.category}
              {product.subcategory && ` > ${product.subcategory}`}
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h5" sx={{ mr: 2 }}>
                ${product.price.toFixed(2)}
              </Typography>
              {product.discount && product.discount > 0 && (
                <Chip
                  label={`${product.discount}% `}
                  color="success"
                  size="small"
                />
              )}
            </Box>

            <Typography variant="body1" paragraph>
              <strong>Stock:</strong> {product.stock} units
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>Status:</strong>
              <Chip
                label={product.promoted ? 'Promoted' : 'Regular'}
                color={product.promoted ? 'success' : 'default'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Grid>

         <Grid size={{ xs: 12, md: 6 }}> 
            <Typography variant="h6" gutterBottom>Media</Typography>
            <Divider sx={{ mb: 2 }} />

            {product.media?.images?.length > 0 ? (
              <Box display="flex" flexWrap="wrap" gap={2}>
                {product.media.images.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt={`Product ${index + 1}`}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No images available
              </Typography>
            )}

            {product.media?.model3d && (
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  3D Model:
                </Typography>
                <Box
                  component="iframe"
                  src={product.media.model3d}
                  sx={{
                    width: '100%',
                    height: 300,
                    border: 'none',
                    borderRadius: 1
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2}>
         <Grid size={{ xs: 12, md: 6 }}> 
            <Typography variant="h6" gutterBottom>Variants</Typography>
            <Divider sx={{ mb: 2 }} />
            {product.variants?.length > 0 ? (
              <List dense>
                {product.variants.map((variant) => (
                  <ListItem key={variant.id}>
                    <ListItemText
                      primary={variant.name}
                      secondary={`Price: $${variant.price?.toFixed(2) || product.price.toFixed(2)} | Stock: ${variant.stock || product.stock}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No variants available
              </Typography>
            )}
          </Grid>

            <Grid size={{ xs: 12, md: 6 }}> 
            <Typography variant="h6" gutterBottom>Tags</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexWrap="wrap" gap={1}>
              {product.tags?.length > 0 ? (
                product.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No tags available
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={onEdit}
          sx={{ mr: 2 }}
        >
          Edit Product
        </Button>
      </Box>
    </Box>
  );
};

export default ProductView;