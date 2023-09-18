const UserProfile = (props) => {
  return <h1>{props.username}</h1>;
};

export default UserProfile;

// only executed on the server, after deployment, with every request
// not statically pregenerated
// context gives access to the full request and responce object
// can also be used when you NEVER want to have staticProps
export async function getServerSideProps(context) {
  const { params, req, res } = context;

  return {
    // can't set revalidate bc function runs for every request
    // notFound & redirect is ok
    props: {
      username: "Ryan",
    },
  };
}
