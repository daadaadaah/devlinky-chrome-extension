/* eslint-disable react/no-array-index-key */
import styled from '@emotion/styled';

import React, { useRef } from 'react';

import {
  useHistory, MemoryRouter, Route, Link, Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import style from '../styles/designSystem';

import { colors, font } from '../styles/commom';

import useCurrentUser from '../hooks/useCurrentUser';

import {
  fetchPreview,
  loadUrl,
  setUrl,
  setComment,
  setTags,
  loadAutoCompleteTags,
  resetAutoCompleteTags,
  submitDevlink,
  setSelectTabMenu,
  removeTag,
} from '../redux/slice';

import { isEmpty, get } from '../utils';

export default function MainPage() {
  const history = useHistory();

  const { currentUser } = useCurrentUser();

  if (isEmpty(currentUser)) {
    history.push('/login');
  }

  const dispatch = useDispatch();

  const selectTabMenu = useSelector(get('selectTabMenu'));

  const handleClickTabMenu = (e) => {
    const newSelectTabMenu = e.target.text;
    dispatch(setSelectTabMenu(newSelectTabMenu));
  };

  const url = useSelector(get('url'));

  if (isEmpty(url)) {
    dispatch(loadUrl());
  }

  const preview = useSelector(get('preview'));

  if (url && isEmpty(preview)) {
    dispatch(fetchPreview());
  }

  const handleChangeUrl = (e) => {
    dispatch(setUrl(e.target.value));
  };

  const handleSearchUrl = () => {
    dispatch(fetchPreview());
  };

  const comment = useSelector(get('comment'));

  const handleChangeComment = (e) => {
    dispatch(setComment(e.target.value));
  };

  const inputTag = useRef();

  const tags = useSelector(get('tags'));
  const autoCompleteTags = useSelector(get('autoCompleteTags'));

  const handleChangeTag = (e) => {
    const newTag = e.target.value.toUpperCase().trim();

    if (isEmpty(newTag)) {
      dispatch(resetAutoCompleteTags());
    } else {
      dispatch(loadAutoCompleteTags(newTag));
    }
  };

  const handleKeyDownEnter = (e) => {
    const newTag = e.target.value.trim();
    const ENTER = 13;

    if (e.keyCode === ENTER) {
      if (newTag && tags.indexOf(newTag) === -1) {
        dispatch(resetAutoCompleteTags());
        dispatch(setTags([...tags, newTag]));
        // 너비보다 더 많은 태그를 입력했을 때, 스크롤 이동하여 입력창으로 포커스 주기
        // 최대 태그 입력 갯수 정하기
        e.target.value = '';
      }
    }
  };

  const handleClickAutoCompleteTag = (index) => {
    const newAutoCompleteTag = autoCompleteTags[index].name;

    dispatch(setTags([...tags, newAutoCompleteTag]));
    inputTag.current.value = '';
    dispatch(resetAutoCompleteTags());
  };

  const handleClickRemoveTag = (removeIndex) => {
    dispatch(removeTag(removeIndex));
    dispatch(resetAutoCompleteTags());
  };

  const handleClickSave = () => {
    if (preview && comment && !isEmpty(tags)) {
      dispatch(submitDevlink());
    }
    // TODO : 디자인 시안 나오면, 추가 구현하기 + useRef 공부 후 없는 곳 포커스
  };

  return (
    <>
      <MemoryRouter initialEntries={['/newlink']}>
        <TabMenus selectTabMenu={selectTabMenu}>
          <li>
            <Link to="/newlink" onClick={handleClickTabMenu}>newlink</Link>
          </li>
          <li>
            <Link to="/archive" onClick={handleClickTabMenu}>archive</Link>
          </li>
        </TabMenus>
        <Layout>
          <Switch>
            <Route path="/newlink">
              <form>
                <fieldset>
                  <label htmlFor="devlink-url">
                    url
                  </label>
                  <input
                    type="text"
                    id="devlink-url"
                    aria-label="devlink-url"
                    placeholder="URL을 입력해주세요"
                    name="url"
                    value={url || ''}
                    onChange={handleChangeUrl}
                  />
                  <button type="button" id="search-url" aria-label="search-url" onClick={handleSearchUrl}>
                    <i className="fa fa-search" />
                  </button>
                </fieldset>
                <fieldset>
                  <h3>preview</h3>
                  {preview
                    ? (
                      <>
                        <img
                          src={preview && preview.thumbnail}
                          alt="thumbnail"
                        />
                        <p>{preview && preview.title}</p>
                        <p>{preview && preview.url}</p>
                      </>
                    )
                    : (
                      <img
                        src="../../assets/images/preview_default.png"
                        alt="preview-default"
                      />
                    )}
                </fieldset>
                <FormField>
                  <label htmlFor="devlink-comment">
                    comment
                  </label>
                  <input
                    type="text"
                    id="devlink-comment"
                    aria-label="devlink-comment"
                    placeholder="Comment를 입력해주세요"
                    name="comment"
                    autoComplete="off"
                    value={comment || ''}
                    onChange={handleChangeComment}
                  />
                </FormField>
                <FormField>
                  <label htmlFor="devlink-tags">
                    tags
                  </label>
                  <TagInputWrapper>
                    <ul>
                      {!isEmpty(tags) && tags.map((tag, index) => (
                        <li key={index}>
                          <TagText>{`#${tag}`}</TagText>
                          <button type="button" alt="btn-remove-tag" title="remove-tag" onClick={() => handleClickRemoveTag(index)} />
                        </li>
                      ))}
                      <li>
                        <input
                          type="text"
                          id="devlink-tags"
                          aria-label="devlink-tags"
                          placeholder={isEmpty(tags) ? 'tag 입력 후 enter를 입력해주세요' : undefined}
                          ref={inputTag}
                          name="tags"
                          autoComplete="off"
                          onChange={handleChangeTag}
                          onKeyDown={handleKeyDownEnter}
                        />
                      </li>
                    </ul>
                  </TagInputWrapper>
                  <AutoCompleteTagsWrapper showAutoCompleteTags={!isEmpty(autoCompleteTags)}>
                    <ul>
                      {!isEmpty(autoCompleteTags)
                      && autoCompleteTags.map((autoCompleteTag, index) => (
                        <li key={index}>
                          <AutoCompleteTagsText onClick={() => handleClickAutoCompleteTag(index)}>{`#${autoCompleteTag.name}`}</AutoCompleteTagsText>
                        </li>
                      ))}
                    </ul>
                  </AutoCompleteTagsWrapper>
                </FormField>
                <SaveButton type="button" id="btn-save" onClick={handleClickSave}>Save a contents</SaveButton>
              </form>
            </Route>
            <Route path="/archive">
              <>
                <p>archive tab menu</p>
              </>
            </Route>
          </Switch>
        </Layout>
      </MemoryRouter>
    </>
  );
}

const TabMenus = styled.ul`  
  margin-top: 30px;

  width: 100%;
  height: 38px;

  padding-left: 24px;
  list-style: none; /* 가로 정렬 */
  
  & li {
    float: left; /* 가로 정렬 */

    height: 100%;
    font-size: ${font.size.large};
    font-weight: ${font.weight.bold};
    line-height: 24px;

    & a {
      color: ${style.common.color};
      text-transform: capitalize;
    }
  }

  & li:nth-of-type(2) {
    margin-left: 16px;
  }
  
  & li:nth-of-type(${({ selectTabMenu }) => (selectTabMenu === 'newlink' ? 1 : 2)}) {
    border-bottom: 3px solid ${colors.white}; /* 선택 */
  }

  & li:nth-of-type(${({ selectTabMenu }) => (selectTabMenu === 'newlink' ? 2 : 1)}){
    opacity: 0.5; /* 미 선택 */
  }
`;

const Layout = styled.div`
  padding: ${style.common.interval.small} ${style.common.interval.small} 48px;
`;

const FormField = styled.fieldset`
  margin-top: 20px;

  display: flex;
  flex-direction: column;

  & label {
    text-transform: capitalize;
    
    font-weight: 300;
    font-size: 12px;
    opacity: 0.8;

    font-family: ${style.font.family.en};
  }

  & label ~ :nth-child(2) {
    margin-top: 4px;

    padding: 0 16px;
    background: ${style.colors.white};
    border-radius: 15px;
  }

  & input {
    height: 30px;

    ::placeholder {
      font-family: ${style.font.family.krNum};
      opacity: 0.5;
    }
  }
`;

const TagInputWrapper = styled.div`
  width: 272px; /* 태그가 많아졌을 때, 늘어나는 걸 방지하기 위해 고정값 사용 */

  & ul {
    display: flex;
    flex-wrap: nowrap; /* 1줄로 표시  */
    overflow: scroll;

    align-items: center;

    & li {
      flex: 0 0 auto;

      & span {

      }

      & button {
        margin-left: 2px;
        width: 10px;
        height: 10px;

        background: url('../../assets/images/tag-remove.png');
      }
    }

    & li:not(:first-of-type) {
      margin-left: 10px;
    }

    & li:last-of-type input {
      width: 200px; /* placeholder 보일 정도만 */
    }
  }

  & ul::-webkit-scrollbar { /* Chrome, Safari, Opera*/
    display: none; /* 스크롤 바 안보이게 */
  }
`;

const TagText = styled.span`
  font-family: ${style.font.family.krNum};
  font-style: normal;
  font-weight: ${style.font.weight.regular};
  font-size: 12px;
  color: #383D4B;
  text-transform: uppercase;
`;

const AutoCompleteTagsWrapper = styled.div`
  margin: 0 16px;

  display: ${({ showAutoCompleteTags }) => (showAutoCompleteTags ? 'block' : 'none')};

  height: 32px;
  background: ${style.colors.white};
  border: 0.25px solid ${style.colors.gray.normal};

  ul {
    display: flex;
    flex-direction: row;
    margin: 8px;

    li {
      list-style: none;

      height: 16px;

      background: #8F8ECF;
      border-radius: 40px;
    }

    li:not(:first-of-type) {
      margin-left: 4px;
    }
  }
`;

const AutoCompleteTagsText = styled.span`

  display: flex;
  align-items: center;

  font-style: normal;
  font-weight: ${style.font.weight.bold};
  font-size: 10px;
  line-height: 12px;

  color:  ${style.colors.white};
  background: #8F8ECF;
  margin: 3px 6px;
  text-transform: uppercase;

  cursor: pointer;
`;

const SaveButton = styled.button`
  position: fixed;
  top: 510px;
  margin: 0 20px;

  width: 240px;
  height: 42px;
  background: ${style.button.normal.background};
  border-radius: 63px;

  font-size: ${style.button.font.size};;
  font-weight: ${style.button.font.weight};
  color:  ${style.button.normal.color};

  &:hover {
    background-color:${style.button.hover.background};
  }
`;
