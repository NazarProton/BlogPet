import React, { useState, useEffect, FC } from "react";
import { useDispatch } from "react-redux";
import CommentsForPost from "../../comments/CommentsForPost";
import LikesForPost from "../PostComponents/likesForPost";
import AddCommentForm from "../../comments/addCommentForm";
import { Pagination, Modal, Card } from "antd";
import {
  IComment,
  IPostsActionsTypes,
} from "../../../store/redux/types/ReduxTypes";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { IUser } from "../../ComponentsTypes";
const noPostAvatar = require("../../../images/no-post-avatar.png") as string;

interface IProps {
  id: string;
  handleOk: () => void;
  handleCancel: () => void;
}

const PostPage: FC<IProps> = ({ id, handleOk, handleCancel }) => {
  const { Meta } = Card;
  const dispatch = useDispatch();
  let postById = useTypedSelector((s) => s.posts.postById);
  let commentsForPostById = useTypedSelector(
    (s) => s.posts.commentsForPostById
  );
  let [followedCommentData, setFollowedCommentData] = useState<IUser | null>(
    null
  );
  const commentToPost = useTypedSelector((s) => s.posts.commentToPost);
  const [crop, setCrop] = useState<IComment[] | null>(null);
  const cropWithoutFolowedComment = commentsForPostById?.filter(
    (c) => !c.followedCommentID
  );
  useEffect(() => {
    dispatch({
      type: IPostsActionsTypes.LOAD_COMMENTS,
      payload: {
        crop,
      },
    });
  }, [crop, dispatch]);
  useEffect(() => {
    if (!crop) {
      if (commentsForPostById && cropWithoutFolowedComment) {
        let cropedCommentsForPostById = cropWithoutFolowedComment?.slice(0, 10);
        setCrop(cropedCommentsForPostById);
      }
    }
  }, [commentsForPostById, crop, cropWithoutFolowedComment, dispatch]);

  const getChoosedCommentToReplyId = function (
    commentId: string,
    comentator: IUser
  ) {
    const comentatorData: IUser = { ...comentator, commentId };
    setFollowedCommentData(comentatorData);
  };

  const defaultPage = 1;
  const changePage = function (page: number, pageSize: number) {
    let cropedCommentsForPostById = cropWithoutFolowedComment?.slice(
      page === 1 ? 0 : pageSize * page - pageSize,
      page === 1 ? pageSize : page * pageSize
    );
    setCrop(cropedCommentsForPostById);
    dispatch({
      type: IPostsActionsTypes.LOAD_COMMENTS,
      payload: {
        crop,
      },
    });
  };

  return (
    <>
      {postById && (
        <div className="container">
          <Modal
            title={postById?.title}
            visible={id === postById._id ? true : false}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
          >
            {postById ? (
              <>
                <Card
                  bordered={false}
                  style={{
                    height: "100%",
                  }}
                  cover={
                    <img
                      alt="example"
                      src={
                        postById.image
                          ? `http://test-blog-api.ficuslife.com/${postById.image}`
                          : noPostAvatar
                      }
                    />
                  }
                >
                  <Meta
                    title={
                      <div className="metaTitle">
                        <LikesForPost post={postById} />{" "}
                        <div className="pInMeta">{postById.title}</div>
                      </div>
                    }
                    description={postById.description}
                  />
                  <p>{postById.fullText}</p>
                </Card>
                <div>
                  <>
                    <div style={{ marginLeft: "15px", marginTop: "10px" }}>
                      {commentToPost &&
                        commentToPost.map((c) => {
                          return (
                            <div key={c._id}>
                              <CommentsForPost
                                comment={c}
                                getChoosedCommentToReplyId={
                                  getChoosedCommentToReplyId
                                }
                              />
                            </div>
                          );
                        })}
                    </div>
                    <div>
                      {crop && (
                        <AddCommentForm
                          followedCommentData={followedCommentData}
                          setFollowedCommentData={setFollowedCommentData}
                        />
                      )}
                    </div>
                  </>
                  <div className="commentsPagination">
                    {!!crop?.length && (
                      <Pagination
                        style={{ marginBottom: "20px" }}
                        showSizeChanger={false}
                        defaultCurrent={defaultPage}
                        total={cropWithoutFolowedComment.length}
                        onChange={(page, pageSize) =>
                          changePage(page, pageSize)
                        }
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <h3 className=" d-flex justify-content-center">
                loading choosed post...
              </h3>
            )}
          </Modal>
        </div>
      )}
    </>
  );
};

export default PostPage;
