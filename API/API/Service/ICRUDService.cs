using System.Collections.Generic;

namespace API.Service
{
    public interface ICRUDService<T>
    {
        // Create a new entity
        Task Add(T entity);

        // Get an entity by its ID
        Task<T> GetById(int id);

        // Update an existing entity
        Task Update(T entity);

        // Delete an entity by its ID
        Task Delete(int id);

        // Get all entities
        Task<IEnumerable<T>> GetAll();
    }
}
