# Mastering useState in React: A Complete Guide

React's `useState` hook is one of the most fundamental and powerful tools in modern React development. Whether you're a beginner or an experienced developer, understanding `useState` deeply is crucial for building efficient and maintainable React applications. This comprehensive guide will take you from the basics to advanced patterns, best practices, and common pitfalls.

## Table of Contents
1. [What is useState?](#what-is-usestate)
2. [Basic Usage](#basic-usage)
3. [Understanding State Updates](#understanding-state-updates)
4. [Common Patterns and Best Practices](#common-patterns-and-best-practices)
5. [Advanced Usage](#advanced-usage)
6. [Performance Considerations](#performance-considerations)
7. [Common Pitfalls and How to Avoid Them](#common-pitfalls-and-how-to-avoid-them)
8. [useState vs Class Components](#usestate-vs-class-components)
9. [Real-World Examples](#real-world-examples)
10. [Testing useState Components](#testing-usestate-components)
11. [Conclusion](#conclusion)

## What is useState?

`useState` is a React Hook that allows functional components to have state. Before hooks, only class components could maintain state. `useState` revolutionized React development by enabling state management in functional components with a cleaner, more intuitive API.

```jsx
import { useState } from 'react';

const [state, setState] = useState(initialValue);
```

The hook returns an array with two elements:
- `state`: The current state value
- `setState`: A function to update the state

## Basic Usage

### Simple Counter Example

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

### Multiple State Variables

```jsx
import React, { useState } from 'react';

function UserProfile() {
  const [name, setName] = useState('John Doe');
  const [age, setAge] = useState(25);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <h1>{name}</h1>
      )}
      <p>Age: {age}</p>
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}
```

## Understanding State Updates

### Synchronous vs Asynchronous Updates

State updates in React are **asynchronous** and **batched**. This means that calling `setState` doesn't immediately update the state:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1); // Re-queues a render
    console.log(count); // Still 0 - hasn't updated yet!
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### Functional Updates

When the new state depends on the previous state, use the functional update form:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    // ✅ Correct: Uses functional update
    setCount(prevCount => prevCount + 1);
  };

  const handleMultipleIncrements = () => {
    // ✅ This will increment by 3
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };

  const handleMultipleIncrementsWrong = () => {
    // ❌ This will only increment by 1
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleMultipleIncrements}>
        Increment x3 (Correct)
      </button>
      <button onClick={handleMultipleIncrementsWrong}>
        Increment x3 (Wrong)
      </button>
    </div>
  );
}
```

### Batching of State Updates

React batches multiple state updates that occur in the same event handler to improve performance:

```jsx
function UserProfile() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  const updateProfile = () => {
    setName('Alice');
    setAge(25);
    // Both updates are batched into a single re-render
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(parseInt(e.target.value) || 0)}
        placeholder="Age"
      />
      <button onClick={updateProfile}>Update Profile</button>
    </div>
  );
}
```

## Common Patterns and Best Practices

### 1. Grouping Related State

When you have multiple related state variables, consider grouping them:

```jsx
// ❌ Avoid: Multiple related state variables
function UserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  // ...
}

// ✅ Better: Group related state
function UserForm() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: ''
  });

  const updateField = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  return (
    <form>
      <input
        value={user.firstName}
        onChange={(e) => updateField('firstName', e.target.value)}
        placeholder="First Name"
      />
      <input
        value={user.lastName}
        onChange={(e) => updateField('lastName', e.target.value)}
        placeholder="Last Name"
      />
      {/* ... other fields */}
    </form>
  );
}
```

### 2. Lazy Initial State

For expensive initial state calculations, use a function:

```jsx
function ExpensiveComponent() {
  const [data, setData] = useState(() => {
    // This function runs only once during initial render
    return expensiveCalculation();
  });

  return <div>{/* component JSX */}</div>;
}

function expensiveCalculation() {
  console.log('Running expensive calculation...');
  // Simulate expensive computation
  return Array.from({ length: 1000 }, (_, i) => i * i).reduce((a, b) => a + b, 0);
}
```

### 3. State Initialization with Props

```jsx
function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  // Reset to initial count when prop changes
  const reset = () => setCount(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### 4. Deriving State from Props

When you need to derive state from props, consider using useEffect:

```jsx
function DataDisplay({ items }) {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const filterItems = (searchTerm) => {
    setFilteredItems(
      items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div>
      <input
        onChange={(e) => filterItems(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Advanced Usage

### 1. Complex State Management with useReducer

When state logic becomes complex, consider using `useReducer`:

```jsx
import { useReducer } from 'react';

const initialState = {
  todos: [],
  filter: 'all'
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = (text) => {
    dispatch({
      type: 'ADD_TODO',
      payload: {
        id: Date.now(),
        text,
        completed: false
      }
    });
  };

  const toggleTodo = (id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const filteredTodos = state.todos.filter(todo => {
    if (state.filter === 'completed') return todo.completed;
    if (state.filter === 'active') return !todo.completed;
    return true;
  });

  return (
    <div>
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            addTodo(e.target.value);
            e.target.value = '';
          }
        }}
        placeholder="Add a todo..."
      />
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. State Management with Context

For global state management, combine useState with useContext:

```jsx
import { createContext, useContext, useState, ReactNode } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function ThemedComponent() {
  const { theme, toggleTheme } = useTheme();

  const styles = {
    backgroundColor: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#333' : '#fff',
    padding: '20px',
    borderRadius: '8px'
  };

  return (
    <div style={styles}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### 3. Optimistic Updates

For better user experience, implement optimistic updates:

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTodo = async (text) => {
    // Optimistic update
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      pending: true
    };

    setTodos(prev => [...prev, newTodo]);

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Replace with real data from API
      setTodos(prev => 
        prev.map(todo => 
          todo.id === newTodo.id 
            ? { ...todo, pending: false }
            : todo
        )
      );
    } catch (error) {
      // Rollback on error
      setTodos(prev => prev.filter(todo => todo.id !== newTodo.id));
      console.error('Failed to add todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li 
            key={todo.id}
            style={{ opacity: todo.pending ? 0.5 : 1 }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
      <button 
        onClick={() => addTodo('New todo')}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </div>
  );
}
```

## Performance Considerations

### 1. Minimizing Re-renders

```jsx
// ❌ Bad: Creates new object on every render
function BadComponent() {
  const [user, setUser] = useState({ name: '', age: 0 });

  const updateName = (newName) => {
    setUser({ ...user, name: newName }); // New object every time
  };

  return <input onChange={(e) => updateName(e.target.value)} />;
}

// ✅ Good: Use functional updates
function GoodComponent() {
  const [user, setUser] = useState({ name: '', age: 0 });

  const updateName = (newName) => {
    setUser(prevUser => ({ ...prevUser, name: newName }));
  };

  return <input onChange={(e) => updateName(e.target.value)} />;
}
```

### 2. Memoizing Callbacks

```jsx
import React, { useState, useCallback } from 'react';

function MemoizedComponent() {
  const [count, setCount] = useState(0);

  // Memoized callback - only recreated when count changes
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Empty dependency array since it uses functional update

  return <ExpensiveChild onIncrement={increment} count={count} />;
}

function ExpensiveChild({ onIncrement, count }) {
  // This component only re-renders when its props change
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
```

### 3. Splitting State for Better Performance

```jsx
// ❌ Bad: Large object causes unnecessary re-renders
function BadPerformance() {
  const [state, setState] = useState({
    user: { name: 'John', email: 'john@example.com' },
    theme: 'light',
    preferences: { notifications: true, language: 'en' }
  });

  const updateTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  // This re-renders the entire component even though only theme changed
  return <div>{/* Component JSX */}</div>;
}

// ✅ Good: Split unrelated state
function GoodPerformance() {
  const [user, setUser] = useState({ name: 'John', email: 'john@example.com' });
  const [theme, setTheme] = useState('light');
  const [preferences, setPreferences] = useState({ 
    notifications: true, 
    language: 'en' 
  });

  const updateTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return <div>{/* Component JSX */}</div>;
}
```

## Common Pitfalls and How to Avoid Them

### 1. Modifying State Directly

```jsx
// ❌ Never do this!
function BadExample() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // Direct mutation!
    setItems(items);
  };

  return <button onClick={addItem}>Add Item</button>;
}

// ✅ Always create new references
function GoodExample() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // Create new array
  };

  return <button onClick={addItem}>Add Item</button>;
}
```

### 2. Storing Derived State

```jsx
// ❌ Bad: Storing derived state
function BadDerivedState() {
  const [items, setItems] = useState([1, 2, 3]);
  const [evenCount, setEvenCount] = useState(0); // Derived from items

  useEffect(() => {
    setEvenCount(items.filter(item => item % 2 === 0).length);
  }, [items]);

  return <div>Even count: {evenCount}</div>;
}

// ✅ Good: Calculate derived state during render
function GoodDerivedState() {
  const [items, setItems] = useState([1, 2, 3]);

  const evenCount = items.filter(item => item % 2 === 0).length;

  return <div>Even count: {evenCount}</div>;
}
```

### 3. State Initialization Issues

```jsx
// ❌ Bad: Expensive calculation on every render
function BadInitialization() {
  const [data, setData] = useState(expensiveCalculation()); // Runs every render!
  
  return <div>{/* Component JSX */}</div>;
}

// ✅ Good: Lazy initialization
function GoodInitialization() {
  const [data, setData] = useState(() => expensiveCalculation()); // Runs once
  
  return <div>{/* Component JSX */}</div>;
}
```

### 4. Not Handling Edge Cases

```jsx
// ❌ Bad: Doesn't handle null/undefined
function BadEdgeCase({ items }) {
  const [selectedItem, setSelectedItem] = useState(items[0]); // Error if items is empty
  
  return <div>{/* Component JSX */}</div>;
}

// ✅ Good: Handles edge cases
function GoodEdgeCase({ items = [] }) {
  const [selectedItem, setSelectedItem] = useState(items[0] || null);
  
  return <div>{/* Component JSX */}</div>;
}
```

## useState vs Class Components

### Class Component Syntax (Old Way)

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  decrement() {
    this.setState(prevState => ({
      count: prevState.count - 1
    }));
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
      </div>
    );
  }
}
```

### Functional Component with useState (Modern Way)

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

**Benefits of useState:**
- Less boilerplate code
- No need for `this` keyword
- Easier to understand and maintain
- Better TypeScript support
- Composable with other hooks

## Real-World Examples

### 1. Form Management

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '', subscribe: false });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h2>Thank you for your message!</h2>
        <p>We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={errors.message ? 'error' : ''}
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>
      
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            name="subscribe"
            checked={formData.subscribe}
            onChange={handleChange}
          />
          Subscribe to newsletter
        </label>
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### 2. Search and Filter Functionality

```jsx
function ProductSearch() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(false);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const mockProducts = [
          { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
          { id: 2, name: 'Phone', category: 'electronics', price: 699 },
          { id: 3, name: 'Book', category: 'books', price: 29 },
          { id: 4, name: 'Headphones', category: 'electronics', price: 199 },
          { id: 5, name: 'Novel', category: 'books', price: 15 },
          { id: 6, name: 'Tablet', category: 'electronics', price: 499 },
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

    return filtered;
  }, [products, searchTerm, category, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setPriceRange({ min: 0, max: 1000 });
    setSortBy('name');
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
        </select>
        
        <div className="price-range">
          <input
            type="number"
            placeholder="Min price"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
          />
          <input
            type="number"
            placeholder="Max price"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
          />
        </div>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
        
        <button onClick={resetFilters}>Reset Filters</button>
      </div>
      
      <div className="products">
        <h3>Found {filteredAndSortedProducts.length} products</h3>
        {filteredAndSortedProducts.map(product => (
          <div key={product.id} className="product">
            <h4>{product.name}</h4>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Pagination Implementation

```jsx
function PaginatedList({ items, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');

  // Calculate pagination
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Sort and slice items
  const sortedItems = [...items].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const currentItems = sortedItems.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <div className="controls">
        <button onClick={toggleSort}>
          Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
        </button>
        <span>
          Showing {currentItems.length} of {items.length} items
        </span>
      </div>
      
      <ul className="item-list">
        {currentItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))}
          </span>
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

## Testing useState Components

### 1. Basic Testing with React Testing Library

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

describe('Counter Component', () => {
  test('renders initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments count when increment button is clicked', () => {
    render(<Counter />);
    
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('decrements count when decrement button is clicked', () => {
    render(<Counter />);
    
    const decrementButton = screen.getByText('Decrement');
    fireEvent.click(decrementButton);
    
    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });

  test('multiple clicks update count correctly', () => {
    render(<Counter />);
    
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });
});
```

### 2. Testing Form Components

```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

describe('ContactForm Component', () => {
  test('renders form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Message:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await user.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  test('clears error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await user.click(submitButton);
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText('Name:');
    await user.type(nameInput, 'John Doe');
    
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  test('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await user.type(screen.getByLabelText('Name:'), 'John Doe');
    await user.type(screen.getByLabelText('Email:'), 'john@example.com');
    await user.type(screen.getByLabelText('Message:'), 'This is a test message');
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
    });
  });
});
```

### 3. Testing Custom Hooks

```jsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
  test('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  test('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(5));
    
    expect(result.current.count).toBe(5);
  });

  test('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  test('decrements count', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(9);
  });

  test('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(7);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

## Conclusion

Mastering `useState` is fundamental to becoming a proficient React developer. Throughout this comprehensive guide, we've covered:

1. **Core Concepts**: Understanding how `useState` works, including asynchronous updates and batching
2. **Best Practices**: Grouping related state, lazy initialization, and proper state management patterns
3. **Advanced Patterns**: Complex state management, optimistic updates, and performance optimization
4. **Common Pitfalls**: Direct mutation, derived state, and edge cases to avoid
5. **Real-World Applications**: Forms, search functionality, pagination, and more
6. **Testing Strategies**: Comprehensive testing approaches for components using `useState`

### Key Takeaways:

- **Use functional updates** when new state depends on previous state
- **Group related state** together to reduce complexity
- **Avoid storing derived state** - calculate it during render
- **Use lazy initialization** for expensive initial state calculations
- **Never mutate state directly** - always create new references
- **Consider performance implications** when structuring your state
- **Test your state logic** thoroughly to ensure reliability

`useState` is simple on the surface but powerful when used correctly. By following the patterns and best practices outlined in this guide, you'll be well-equipped to build robust, maintainable, and performant React applications.

Remember that `useState` is just the beginning of React's state management capabilities. As your applications grow more complex, you might want to explore other hooks like `useReducer`, `useContext`, and state management libraries like Redux or Zustand. But mastering `useState` first will provide you with a solid foundation for understanding more advanced state management concepts.

Happy coding! 🚀