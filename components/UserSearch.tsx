import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';
import { userAPI } from '@/services/userAPI';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  picture?: string;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
  placeholder?: string;
  style?: any;
}

export const UserSearch: React.FC<UserSearchProps> = ({ 
  onSelectUser, 
  placeholder = 'Search by name or email...',
  style 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setError(null);
      
      try {
        const response = await userAPI.searchUsers(query);
        
        if (response.success && response.data) {
          const results = Array.isArray(response.data) ? response.data : [];
          setSearchResults(results);
          setHasSearched(true);
          
          if (results.length === 0) {
            setError('No users found');
          }
        } else {
          setSearchResults([]);
          setError(response.message || 'Failed to search users');
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setError('An error occurred while searching');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    
    if (text.length > 1) {
      debouncedSearch(text);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setError(null);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleSelectUser = (user: User) => {
    // Handle both _id and id fields
    const userId = (user as any)?._id || user?.id;
    
    if (!user || !userId) {
      console.error('Invalid user selected:', user);
      return;
    }
    
    console.log('Selected user:', user);
    
    // Ensure we're passing a complete user object with at least an id field
    const userWithId = { ...user, id: userId };
    onSelectUser(userWithId);
    
    // Update search query with user's name
    const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.email || '';
    setSearchQuery(displayName);
    setSearchResults([]);
    setHasSearched(false);
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const userKey = `user-${item.id || Math.random().toString(36).substr(2, 9)}`;
    return (
      <TouchableOpacity 
        key={userKey}
        style={styles.userItem} 
        onPress={() => handleSelectUser(item)}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.userEmail}>{item.email || 'No email'}</Text>
        </View>
        <Ionicons name="person-add" size={20} color="#2D5016" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons 
          name="search" 
          size={20} 
          color="#666" 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          autoFocus={true}
          clearButtonMode="while-editing"
          returnKeyType="search"
          onSubmitEditing={() => searchQuery.trim() && debouncedSearch(searchQuery.trim())}
        />
        {isSearching ? (
          <ActivityIndicator size="small" color="#2D5016" style={styles.loadingIndicator} />
        ) : searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {(searchResults.length > 0 || error || (hasSearched && searchQuery.length > 1)) && (
        <View style={[
          styles.resultsContainer,
          Platform.OS === 'web' && { maxHeight: 300 },
        ]}>
          {isSearching ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="small" color="#2D5016" />
              <Text style={styles.statusText}>Searching...</Text>
            </View>
          ) : error ? (
            <View style={styles.statusContainer}>
              <Ionicons name="alert-circle" size={20} color="#C94A3A" />
              <Text style={[styles.statusText, styles.errorText]}>{error}</Text>
            </View>
          ) : searchResults.length === 0 && hasSearched ? (
            <View style={styles.statusContainer}>
              <Ionicons name="search" size={20} color="#999" />
              <Text style={styles.statusText}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              keyboardShouldPersistTaps="handled"
              style={styles.resultsList}
              keyboardDismissMode="on-drag"
              ListFooterComponent={<View style={{ height: 10 }} />}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D9E3CE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontFamily: 'Inter_400Regular',
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 6,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    overflow: 'hidden',
  },
  resultsList: {
    flex: 1,
    maxHeight: 300,
  },
  '@global': {
    body: {
      overflow: 'hidden',
    },
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#fff',
  },
  userItemPressed: {
    backgroundColor: '#f9f9f9',
  },
  statusContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    color: '#C94A3A',
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1A2810',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7F5A',
    fontFamily: 'Inter_400Regular',
  },
});
