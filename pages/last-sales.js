import { useEffect, useState } from "react";
import useSWR from "swr";

const LastSalesPage = (props) => {
  const [sales, setSales] = useState(props.sales);
  // const [isLoading, setIsLoading] = useState(false);

  const url = `https://nextjs-course-8fb88-default-rtdb.europe-west1.firebasedatabase.app/sales.json`;

  // const fetcher = (url) =>
  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const transformedSales = [];

  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }

  //       return transformedSales;
  //     });

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(url, fetcher);

  useEffect(() => {
    if (data) {
      const transformedSales = [];

      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume,
        });
      }

      setSales(transformedSales);
    }
  }, [data]);

  // useEffect(() => {
  //   const url = `https://nextjs-course-8fb88-default-rtdb.europe-west1.firebasedatabase.app/sales.json`;

  //   setIsLoading(true);

  //   fetch(url)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const transformedSales = [];

  //       for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume,
  //         });
  //       }
  //       setSales(transformedSales);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //     });
  // }, []);

  if (error) {
    return <p>Failed to load!</p>;
  }

  if (!sales && !data) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          {sale.username} - ${sale.volume}
        </li>
      ))}
    </ul>
  );
};

export async function getStaticProps() {
  const url = `https://nextjs-course-8fb88-default-rtdb.europe-west1.firebasedatabase.app/sales.json`;

  const transformedSales = [];

  try {
    const response = await fetch(url);
    const data = await response.json();

    for (const key in data) {
      transformedSales.push({
        id: key,
        username: data[key].username,
        volume: data[key].volume,
      });
    }
  } catch (err) {
    console.log(err);
  }

  return { props: { sales: transformedSales } };
}

export default LastSalesPage;
