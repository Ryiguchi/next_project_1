import path from "path";
import fs from "fs/promises";

const ProductDetailPage = ({ loadedProduct }) => {
  // not needed if 'fallback: 'blocking''

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  const { title, description } = loadedProduct;

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
};

const getData = async () => {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
};

export async function getStaticProps(context) {
  const { params } = context;

  const productId = params.pid;

  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

export async function getStaticPaths() {
  const data = await getData();

  const paths = data.products.map((product) => ({
    params: {
      pid: product.id,
    },
  }));

  return {
    paths,
    // true, false, 'blocking'
    // 'blocking' will prevent page from rendering until the data if fetched and the page is generated
    // use 'true' and a conditional in the component to show a loading state before page generation
    // fallback: false,
    // can use 'fallback: true' along with 'notFound' to show 404 if params don't yield data
    fallback: true,
  };
}

export default ProductDetailPage;
