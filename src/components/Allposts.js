import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import { htmlToText } from "html-to-text";
import { homePosts } from "../store/asyncMethods/PostMethods";
import Loader from "./Loader";
import Pagination from "./Pagination";
import toast, { Toaster } from 'react-hot-toast';
import {
	REDIRECT_FALSE,
	REMOVE_MESSAGE,
	SET_LOADER,
	CLOSE_LOADER,
	SET_MESSAGE,
} from '../store/types/PostTypes';
import { fetchPosts } from '../store/asyncMethods/PostMethods';
import { BsArchive } from 'react-icons/bs';
import axios from 'axios';

const Home = () => {
  const searchRef = useRef("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState("");
  let { page } = useParams();
  if (page === undefined) {
    page = 1;
  }
  const {
    user: { _id },
    token,
} = useSelector((state) => state.AuthReducer);
  const { loading } = useSelector((state) => state.PostReducer);
  const { posts, count, perPage } = useSelector((state) => state.FetchPosts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(homePosts(page));
  }, [page]);

  const getSearchTerm = () => {
    searchKeyword(searchRef.current.value);
  };

  const searchKeyword = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (searchTerm !== "") {
      const newContactList = posts.filter((post) => {
        return Object.values(post)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    } else {
      setSearchResults(posts);
    }
  };

  const onCategory = (e) => {
    if (e.target.value !== "") {
    }
  };

  const deletePost = async (id) => {
    const confirm = window.confirm('Are you really want to delete this post?');
    if (confirm) {
        dispatch({ type: SET_LOADER });
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const {
                data: { msg },
            } = await axios.get(`/delete/${id}`, config);
            dispatch(fetchPosts());
            dispatch({ type: SET_MESSAGE, payload: msg });
        } catch (error) {
            dispatch({ type: CLOSE_LOADER });
            console.log(error);
        }
    }
};
  return (
    <>
      <Helmet>
        <title>Blogify</title>
      </Helmet>

      <div className="container">
        <div className="row mt-100" style={{ marginBottom: "30px" }}>
          <div className="col-9 home">
            {!loading ?  searchResults.length > 0 ? (
                searchResults.map((post) => (
                    <>
                    <div className="post__header__user">
                            <span>{post.userName}</span>
                            <span>
                              {moment(post.updatedAt).format("MMM Do YY")}
                            </span>
                          </div>
                    <div className="dashboard__posts" key={post._id}>
                    <div className="dashboard__posts__title">
                      <Link to={`/details/${post.slug}`}>{post.title}</Link>
                      <span>Published {moment(post.updatedAt).fromNow()}</span>
                    </div>
                    <div className="dashboard__posts__links">
                      <BsArchive
                        onClick={() => deletePost(post._id)}
                        className="icon"
                      />
                    </div>
                  </div>
                  </>
                ))
              ):( posts.length > 0 ? (
                posts.map((post) => (
                    <>
                    <div className="post__header__user">
                            <span>{post.userName}</span>
                            <span>
                              {moment(post.updatedAt).format("MMM Do YY")}
                            </span>
                          </div>
                    <div className="dashboard__posts" key={post._id}>
                    <div className="dashboard__posts__title">
                      <Link to={`/details/${post.slug}`}>{post.title}</Link>
                      <span>Published {moment(post.updatedAt).fromNow()}</span>
                    </div>
                    <div className="dashboard__posts__links">
                      <BsArchive
                        onClick={() => deletePost(post._id)}
                        className="icon"
                      />
                    </div>
                  </div>
                  </>
                ))
              ) : (
                "No posts"
              )
            ) : (
              <Loader />
            )}
          </div>
          <div className="col-3" style={{ padding: "2rem" }}>
            <h3>Search Post</h3>
            <br />
            <div className="input-group rounded">
              <input
                ref={searchRef}
                type="search"
                className="form-control rounded"
                placeholder="Search.."
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={getSearchTerm}
                style={{
                  padding: "6px",
                  border: "none",
                  marginTop: "8px",
                  marginRight: "16px",
                  fontSize: "17px",
                }}
              />
            </div>
            <br></br>
            <div className="input-group rounded">
              <h3>Search by Category</h3>
              <br />

              <select name="" id="" onChange={onCategory}>
                <option value="">Please Select Category</option>
                <option value="It">It</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div></div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <Pagination
              path="home"
              page={page}
              perPage={perPage}
              count={count}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
