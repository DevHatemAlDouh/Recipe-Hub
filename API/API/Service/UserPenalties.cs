using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class UserPenalties
    {
        private readonly APIContext _context;

        public UserPenalties(APIContext context)
        {
            _context = context;
        }

        public async Task<UserPenaltyInfo> GetById(int id)
        {
            var penalty = await _context.UserPenalties.FirstOrDefaultAsync(p => p.Id == id);
            if (penalty == null) return null;

            return new UserPenaltyInfo
            {
                Id = penalty.Id,
                UserID = penalty.UserID,
                PenaltyID = penalty.PenaltyID,
                IsActive = penalty.IsActive,
                CreatedAt = penalty.CreatedAt,
                UpdatedAt = penalty.UpdatedAt
            };
        }

        public async Task Grant(UserPenaltyInfo entity)
        {
            var penalty = await _context.Penalties.FirstOrDefaultAsync(p => p.Id == entity.PenaltyID);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.UserID);

            if (penalty != null || user != null)
            {
                var userPenalty = new UserPenalty
                {
                    UserID = entity.UserID,
                    PenaltyID = entity.PenaltyID,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    User = user
                };

                await _context.UserPenalties.AddAsync(userPenalty);
                await _context.SaveChangesAsync();

                var terms = await _context.Terms
                    .Where(t => t.penaltyid == entity.PenaltyID)
                    .Select(t => new Terms
                    {
                        Id = t.Id,
                        penaltyid = t.penaltyid,
                        permissionid = t.permissionid
                    }).ToListAsync();


                foreach (var term in terms) 
                {
                    var userPermmtions = await _context.UserPermissions.FirstOrDefaultAsync(u => u.PermissionID == term.permissionid);
                    userPermmtions.IsActive = false;
                    userPermmtions.UpdatedAt = DateTime.Now;


                    _context.UserPermissions.Update(userPermmtions);
                    await _context.SaveChangesAsync();
                }

                entity.Id = userPenalty.Id; // Update the entity with the generated Id
            }
        }

        public async Task<string> Revoke(int userpenaltyId)
        {
            var entity = await GetById(userpenaltyId);
            var userPenalty = await _context.UserPenalties.FirstOrDefaultAsync(p => p.Id == entity.Id);
            var penalty = await _context.Penalties.FirstOrDefaultAsync(p => p.Id == entity.PenaltyID);

            if (userPenalty.IsActive)
            {
                
                if (userPenalty.CreatedAt.HasValue)
                {
                    int year, month, day, hour, minute, second, millisecond;
                    DateTime penalty_createdAt;
                    if (!userPenalty.UpdatedAt.HasValue)
                    {
                        penalty_createdAt = penalty.CreatedAt.Value;
                    }
                    else
                    {
                        penalty_createdAt = penalty.UpdatedAt.Value;
                    }
                    
                    DateTime createdAt = userPenalty.CreatedAt.Value;
                    DateTime TimeOut = penalty.TimeOut;


                    year = TimeOut.Year - penalty_createdAt.Year;
                    month = TimeOut.Month - penalty_createdAt.Month;
                    day = TimeOut.Day - penalty_createdAt.Day;
                    hour = TimeOut.Hour - penalty_createdAt.Hour;
                    minute = TimeOut.Minute - penalty_createdAt.Minute;
                    second = TimeOut.Second - penalty_createdAt.Second;
                    millisecond = TimeOut.Millisecond - penalty_createdAt.Millisecond;

                    DateTime intervalTime = new DateTime(year, month, day, hour, minute, second, millisecond);

                    year = createdAt.Year + intervalTime.Year;
                    month = createdAt.Month + intervalTime.Month;
                    day = createdAt.Day + intervalTime.Day;
                    hour = createdAt.Hour + intervalTime.Hour;
                    minute = createdAt.Minute + intervalTime.Minute;
                    second = createdAt.Second + intervalTime.Second;
                    millisecond = createdAt.Millisecond + intervalTime.Millisecond;

                    DateTime newTime = new DateTime(year, month, day, hour, minute, second, millisecond);
                    if(newTime > DateTime.Now)
                    {
                        userPenalty.IsActive = false;
                        userPenalty.UpdatedAt = DateTime.Now;
                        _context.UserPenalties.Update(userPenalty);
                        await _context.SaveChangesAsync();
                        var terms = await _context.Terms
                            .Where(t => t.penaltyid == entity.PenaltyID)
                            .Select(t => new Terms
                            {
                                Id = t.Id,
                                penaltyid = t.penaltyid,
                                permissionid = t.permissionid
                            }).ToListAsync();


                        foreach (var term in terms)
                        {
                            var userPermmtions = await _context.UserPermissions.FirstOrDefaultAsync(u => u.PermissionID == term.permissionid);
                            userPermmtions.IsActive = true;
                            userPermmtions.UpdatedAt = DateTime.Now;


                            _context.UserPermissions.Update(userPermmtions);
                            await _context.SaveChangesAsync();
                        }
                        return null;
                    }
                }
                
            }
            return penalty.Description;

            
        }

        public async Task<IEnumerable<UserPenaltyInfo>> GetAllpenalty(int id)
        {
            var userPenalties = await _context.UserPenalties
                .Where(u => u.UserID == id && u.IsActive == true)
                .Select(u => new UserPenaltyInfo
                {
                    Id = u.Id,
                    UserID = u.UserID,
                    PenaltyID = u.PenaltyID,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                }).ToListAsync();

            if (!userPenalties.Any())
            {
                return new List<UserPenaltyInfo>();
            }

            return userPenalties;
        }

        public async Task Update(int id)
        {
            var userpwnalties = await _context.UserPenalties.FirstOrDefaultAsync(c => c.Id == id);
            if (userpwnalties != null)
            {
                userpwnalties.IsActive = false;
                userpwnalties.UpdatedAt = DateTime.Now;

                _context.UserPenalties.Update(userpwnalties);
                await _context.SaveChangesAsync();
            }
        }
    }
}
