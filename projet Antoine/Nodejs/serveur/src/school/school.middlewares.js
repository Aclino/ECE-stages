import School from './school.model';

export async function sendAllSchools(req, res, next) {
    try {
        res.send(await School.find().exec());
    } catch (error) {
        next(error);
    }
}

export async function createNewSchool(req, res, next) {
    const {name} = req.body;
    try {
        const newSchoolSaved = await new School({name}).save();
        res.send(newSchoolSaved);
    } catch (error) {
        next({
            message: `Erreur lors de la création de l'école.`
        });
    }
}
