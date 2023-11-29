const db = require('../Models/config/knexConfig');

const getActivities = async () => {
    try {
        return await db
            .select('*')
            .from('activities')
            .where({
                is_deleted: false,
            })
        // .orderBy('titile', 'desc') // Assuming 'created_at' is the timestamp for when the accommodation was created
        // .limit(5);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching activities');
    }
};

const getActivitiesByID = async (activities_id) => {
    try {
        return await db('activities')
            .select('*')
            .where({
                is_deleted: false,
                activities_id: activities_id
            });
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching activities by ID');
    }
};

const addActivities = async (activitiesData) => {
    try {
        return await db('activities')
            .insert(activitiesData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding activities');
    }
};

const updateActivities = async (activities_id, activitiesData) => {
    try {
        return await db('activities')
            .where({ activities_id: activities_id })
            .update(activitiesData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error updating activity');
    }
};

const markActivityAsDeleted = async (activities_id) => {
    try {
        return await db('activities')
            .where({ activities_id: activities_id })
            .update({ is_deleted: true });
    } catch (err) {
        console.error(err);
        throw new Error('Error marking activities as deleted');
    }
};


const addCommentToAc = async (activities_id, user_id, comment_text) => {
    try {
        const activitiesResult = await db('activities')
            .where({ activities_id: activities_id, is_deleted: false })
            .first();

        if (!activitiesResult) {
            throw new Error('activity not found or deleted');
        }

        const userResult = await db('users')
            .where({ user_id: user_id })
            .first();

        if (!userResult) {
            throw new Error('User not found');
        }

        return await db('comments')
            .insert({
                activities_id: activities_id,
                user_id: user_id,
                comment_text: comment_text
            })
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding comment');
    }
};
const getActivitiesWithComments = async (activities_id) => {
    try {
        return await db('activities')
            .where('activities.is_deleted', false)
            .where('activities.activities_id', activities_id)
            .join('comments', 'activities.activities_id', '=', 'comments.activities_id')
            .join('users', 'comments.user_id', '=', 'users.user_id')
            .select(
                'activities.activities_id',
                'comments.comment_id',
                'comments.comment_text',
                'comments.timestamp as comment_timestamp',
                'users.user_id',
                'users.first_name',
                'users.last_name'
            );
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching activities with comments');
    }
};

const getActivitiesPaginated = async (page, pageSize) => {
    try {
        const offset = (page - 1) * pageSize;
        return await db('activities')
            .orderBy('title', 'asc')
            .where('is_deleted', false)
            .limit(pageSize)
            .offset(offset);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching paginated accommodations');
    }
};

module.exports = {
    getActivities,

    getActivitiesByID,

    addActivities,

    updateActivities,

    markActivityAsDeleted,

    addCommentToAc,

    getActivitiesWithComments,

    getActivitiesPaginated
};
