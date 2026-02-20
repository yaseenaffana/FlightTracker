import PropTypes from 'prop-types';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="search">
      <div className="search-icon" aria-hidden="true">⌕</div>
      <input
        type="text"
        className="search-bar"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

SearchBar.defaultProps = {
  placeholder: "Search flights...",
};

export default SearchBar;