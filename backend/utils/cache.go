package utils

import (
	"sync"
	"time"
)

type CacheItem struct {
	Value      interface{}
	Expiration int64
}

type MemoryCache struct {
	items sync.Map
}

var GlobalCache = &MemoryCache{}

// Set stores a value in the cache with a specific duration.
func (c *MemoryCache) Set(key string, value interface{}, duration time.Duration) {
	var expiration int64
	if duration > 0 {
		expiration = time.Now().Add(duration).UnixNano()
	}
	c.items.Store(key, CacheItem{
		Value:      value,
		Expiration: expiration,
	})
}

// Get retrieves a value from the cache. It deletes the item if it has expired.
func (c *MemoryCache) Get(key string) (interface{}, bool) {
	item, ok := c.items.Load(key)
	if !ok {
		return nil, false
	}
	cachedItem := item.(CacheItem)
	if cachedItem.Expiration > 0 && time.Now().UnixNano() > cachedItem.Expiration {
		c.items.Delete(key)
		return nil, false
	}
	return cachedItem.Value, true
}

// Delete removes a specific key from the cache.
func (c *MemoryCache) Delete(key string) {
	c.items.Delete(key)
}

// ClearUserCache invalidates all cache entries for a specific user.
func (c *MemoryCache) ClearUserCache(userID string) {
	c.items.Range(func(key, value interface{}) bool {
		kStr, ok := key.(string)
		if ok {
			// If key starts with the user ID, clear it
			if len(kStr) >= len(userID) && kStr[:len(userID)] == userID {
				c.items.Delete(key)
			}
		}
		return true
	})
}
