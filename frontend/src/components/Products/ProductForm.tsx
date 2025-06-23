import { TextField, Button, Grid, Paper, Typography, Switch, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  category: Yup.string().required('Required'),
  price: Yup.number().min(0).required('Required'),
  stock: Yup.number().min(0).required('Required'),
});

const ProductForm = ({ initialValues, onSubmit, title, businessId }: any) => {
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      tags: [],
      mediaImages: '',
      promoted: false,
    },
    validationSchema,
    onSubmit: (values) => {
      const product = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        media: {
          images: values.mediaImages
            ? values.mediaImages.split(',').map((url: string) => url.trim()).filter(Boolean)
            : [],
        },
        variants: [],
        businessId: businessId || 1,
        promoted: values.promoted,
      };
      onSubmit(product);
    },
    enableReinitialize: true,
  });

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      {title && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
           <Grid size={{ xs: 12}}> 
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name ? (formik.errors.name as string | undefined) : undefined}
            />
          </Grid>
          <Grid size={{ xs: 12}}> 
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description ? (formik.errors.description as string | undefined) : undefined}
            />
          </Grid>
         <Grid size={{ xs: 12}}> 
            <TextField
              fullWidth
              name="category"
              label="Category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category ? (formik.errors.category as string | undefined) : undefined}
            />
          </Grid>
         <Grid size={{ xs: 12,sm: 6}}> 
            <TextField
              fullWidth
              type="number"
              name="price"
              label="Price"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price ? (formik.errors.price as string | undefined) : undefined}
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid size={{ xs: 12,sm: 6}}> 
            <TextField
              fullWidth
              type="number"
              name="stock"
              label="Stock"
              value={formik.values.stock}
              onChange={formik.handleChange}
              error={formik.touched.stock && Boolean(formik.errors.stock)}
              helperText={formik.touched.stock ? (formik.errors.stock as string | undefined) : undefined}
              inputProps={{ min: 0 }}
            />
          </Grid>
            <Grid size={{ xs: 12}}> 
            <TextField
              fullWidth
              name="tags"
              label="Tags"
              value={formik.values.tags}
              onChange={formik.handleChange}
            />
          </Grid>
           <Grid size={{ xs: 12}}> 
            <TextField
              fullWidth
              name="mediaImages"
              label="Image URLs"
              value={formik.values.mediaImages}
              onChange={formik.handleChange}
            />
          </Grid>
           <Grid size={{ xs: 12}}> 
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.promoted}
                  onChange={formik.handleChange}
                  name="promoted"
                  color="primary"
                />
              }
              label="Promoted"
            />
          </Grid>
           <Grid size={{ xs: 12}}> 
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;