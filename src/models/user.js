const bcrypt = require('bcrypt')
let validTypes = [1,2,3,4];

module.exports = ( sequelize, DataTypes ) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'The name field must contain characters' },
                notNull: { msg: 'The name field is required' },
                min: {
                    args: [3],
                    msg: 'The name field must contain least 3 characters'
                },
                max: {
                    args: [200],
                    msg: 'The name is too long'
                }
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        picture: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                isUrl: { msg: 'The file must be an image! ' }            
            }
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'You must chose one type !' },
                isInt: { msg: 'You select one valid type !' },
                isTypesValid(value) {
                    if(!value){
                        throw new Error('You must chose one type !')
                    }
                  
                    if (!validTypes.includes(value)) {
                        throw new Error(`The user type must be contained in this list ${validTypes}`);
                        
                    }
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {
                    args: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/],
                    msg: "The password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number and a special character."
                }
            }
        }
    },{
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    // Hacher le mot de passe après validation
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        },
        timestamps: true,
    })
}