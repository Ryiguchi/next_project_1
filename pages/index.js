import path from 'path';
import fs from 'fs/promises';
import Link from 'next/link';

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>
            {product.title} PRODUCTION
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps(context) {
  console.log('regenerating...');
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      // redirects the page instead of rendering the above page
      redirect: {
        destination: '/no-data',
      },
    };
  }

  if (data.products.length === 0) {
    return {
      // 'true' - returns the 404 page
      notFound: true,
    };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10,
  };
}

export default HomePage;
