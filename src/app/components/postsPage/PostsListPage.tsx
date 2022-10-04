import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { Pagination, Button, Card, Row, Col, Input } from "antd";
import { useState } from "react";
import PostPage from "./PostPage/PostPage";
import PostAddModal from "./PostComponents/PostAddModal";
import LikesForPost from "./PostComponents/likesForPost";
import EditPostModal from "./PostComponents/editPostModal";
import "./PostListPage.scss";
import { IPostsActionsTypes } from "../../store/redux/types/ReduxTypes";
import { useTypedSelector } from "../../hooks/useTypedSelector";
const noPostAvatar = require("../../images/no-post-avatar.png") as string;

const PostListPage: FC = () => {
  const { Meta } = Card;
  const { Search } = Input;
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentUser = useTypedSelector((s) => s.users.currentUser);
  const [searchStatus, setSearchStatus] = useState("");
  const posts = useTypedSelector((state) => state.posts);
  const [defaultPage, setDefaultPage] = useState(
    posts.skip ? posts.skip / 10 + 1 : 1
  );
  const [currentPage, setCurrentPage] = useState(
    posts.data?.length ? posts.data.length : 0
  );
  const showModal = (postid: string) => {
    setIsModalVisible(true);
    getPostById(postid);
  };

  const handleCancel = () => {
    setIsModalVisible((prevStet) => !prevStet);
  };

  if (currentPage === 0) {
    dispatch({
      type: IPostsActionsTypes.LOAD_POSTS,
    });
    setCurrentPage(10);
  }

  const changePage = (newPage = 1, pageSize: number, e = searchStatus) => {
    setDefaultPage(newPage);
    dispatch({
      type: IPostsActionsTypes.LOAD_POSTS_PAGINATION,
      payload: {
        search: e,
        limit: posts.limit,
        skip: newPage * 10 - 10,
        total: posts.total,
      },
    });
  };
  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStatus(event.target.value);
    changePage(1, 10, event.target.value);
  };
  const getPostById = (postId: string) => {
    dispatch({
      type: IPostsActionsTypes.LOAD_POSTS_BY_ID,
      payload: {
        postId,
      },
    });
  };

  return (
    <>
      <div className="container">
        <Search
          placeholder="search posts"
          onChange={search}
          value={posts.search ? posts.search : ""}
        />
        <PostAddModal />
      </div>
      {posts.loading && !posts.data ? (
        <h3 style={{ marginLeft: "100px" }}>Loading...</h3>
      ) : (
        <>
          <div className="container">
            <Row gutter={[8, 8]}>
              {posts.data &&
                posts.data.map((post) => (
                  <Col key={post._id} xs={24} sm={12} md={12} lg={8} xl={6}>
                    <Card
                      hoverable
                      style={{ height: "100%" }}
                      cover={
                        <img
                          alt="example"
                          src={
                            post.image
                              ? `http://test-blog-api.ficuslife.com/${post.image}`
                              : noPostAvatar
                          }
                          className="posts_image_img_svg"
                        />
                      }
                    >
                      <Meta
                        title={
                          <div className="metaTitle">
                            <LikesForPost post={post} />{" "}
                            <div className="pInMeta">{post.title}</div>
                          </div>
                        }
                        description={post.description}
                      />
                      <div>
                        <div className="card-body">
                          <div className="modalButton">
                            <Button
                              type="primary"
                              onClick={() => showModal(post._id)}
                            >
                              Open more
                            </Button>
                            {currentUser &&
                              post.postedBy === currentUser._id && (
                                <EditPostModal post={post} />
                              )}
                          </div>
                          {isModalVisible && !posts.IsLoading && (
                            <PostPage
                              id={post._id}
                              handleOk={handleCancel}
                              handleCancel={handleCancel}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
          <div className="postsPagination">
            <Pagination
              showQuickJumper
              showSizeChanger={false}
              defaultCurrent={defaultPage}
              total={posts.total}
              onChange={(page, pageSize) => changePage(page, pageSize)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default PostListPage;
