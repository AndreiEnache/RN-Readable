import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getSortBy, getCategory, getCategories } from '../../reducers/posts';
import { sortPostsBy, loadPosts, loadCategories, changeCategory } from '../../actions';

class PostFilter extends Component {
  componentDidMount() {
    const { category } = this.props.match.params;
    if (category !== this.props.categoryName) {
      this.props.loadCategories(category);
      this.props.loadPosts(category);
    }
  }

  handleCategoryChange = (event, { value }) => {
    this.props.changeCategory(value);
  };

  handleSortChange = (event, { value }) => {
    this.props.sortPostsBy(value);
  };
  render() {
    const { categoryName, categories, sortBy } = this.props;
    return (
      <Segment>
        <Form>
          <Form.Group widths="equal">
            <Form.Dropdown
              value={categoryName}
              options={categories}
              selection
              label="Category"
              placeholder="Category"
              name="categoryName"
              onChange={this.handleCategoryChange}
            />
            <Form.Dropdown
              selection
              placeholder="Sort"
              label="Sort"
              name="sort"
              value={sortBy}
              onChange={this.handleSortChange}
              options={[
                {
                  text: 'Sort by date',
                  value: 'timestamp',
                  key: 'timestamp',
                },
                {
                  text: 'Sort by vote count',
                  value: 'voteScore',
                  key: 'voteScore',
                },
              ]}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  }
}

PostFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryName: PropTypes.string,
      category: PropTypes.string,
    }).isRequired,
  }).isRequired,
  categoryName: PropTypes.string.isRequired,
  loadCategories: PropTypes.func.isRequired,
  loadPosts: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  changeCategory: PropTypes.func.isRequired,
  sortPostsBy: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  sortBy: getSortBy(state),
  categoryName: getCategory(state),
  categories: getCategories(state),
});

export default connect(mapStateToProps, {
  loadPosts,
  sortPostsBy,
  loadCategories,
  changeCategory,
})(PostFilter);
