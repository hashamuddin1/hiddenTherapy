/**
 * @swagger
 * /api/doctorSignUp:
 *   post:
 *     summary: Sign Up Of Doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createDoctor'
 *     responses:
 *       200:
 *         description: User Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createDoctor'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     createDoctor:
 *       type: object
 *       required:
 *         - email
 *         - phone_number
 *         - first_name
 *         - last_name
 *         - password
 *         - field
 *       properties:
 *         email:
 *           type: string
 *         phone_number:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         password:
 *           type: string
 *         field:
 *           type: string
 */

/**
 * @swagger
 * /api/SpecificDoctor:
 *   get:
 *     summary: Get Specific Doctor
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         type: string
 *         required: true
 *     description: Fetch Any Specific Doctor
 *     responses:
 *       200:
 *         description: Returns Specific Doctor
 */

/**
 * @swagger
 * /api/updateDoctor:
 *   put:
 *     summary: Update A Doctor
 *     tags: [Doctor]
 *     parameters:
 *      - in: query
 *        name: doctorId
 *        type: string
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateDoctor'
 *     responses:
 *       200:
 *         description: Doctor Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/updateDoctor'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     updateDoctor:
 *       type: object
 *       required:
 *         - first_name
 *         - middle_name
 *         - last_name
 *       properties:
 *         first_name:
 *           type: string
 *         middle_name:
 *           type: string
 *         last_name:
 *           type: string
 */

/**
 * @swagger
 * /api/deleteDoctor:
 *   delete:
 *     summary: Delete Doctor Account
 *     tags: [Doctor]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The Doctor was deleted
 *       404:
 *         description: The Doctor was not found
 */
