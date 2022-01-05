export const ErrorFormulario = (form, $refs, formErrores) => {
    formErrores = false
    Object.keys(form).forEach(f => {
    if (!form[f]) formErrores = true
        $refs[f].validate(true)
    })
}

export default {
    ErrorFormulario
}