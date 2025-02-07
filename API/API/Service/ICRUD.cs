namespace API.Service
{
    public interface ICRUD<T>
    {
        // Create a new entity
        void Add(T entity);

        // Get an entity by its ID
        T GetById(int id);

        // Update an existing entity
        void Update(T entity);

        // Delete an entity by its ID
        void Delete(int id);

        // Get all entities
        IEnumerable<T> GetAll();
    }
}
