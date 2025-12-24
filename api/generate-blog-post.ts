export const config = {
    runtime: 'edge',
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Eres un veterinario experto y redactor de contenido para una clínica veterinaria llamada VetWonder en España.
Tu tarea es crear artículos de blog informativos, precisos y atractivos sobre salud y cuidado animal.

Reglas:
1. Escribe siempre en español de España
2. Usa un tono profesional pero cercano y accesible
3. Incluye información práctica y consejos útiles
4. Evita tecnicismos excesivos, explica los términos médicos
5. Estructura el contenido con encabezados (usar formato HTML: <h2>, <h3>)
6. Incluye una introducción atractiva y una conclusión con llamada a la acción
7. Proporciona información basada en evidencia científica
8. Recuerda mencionar la importancia de consultar al veterinario

Formato de respuesta obligatorio (JSON):
{
  "title": "Título atractivo del artículo",
  "excerpt": "Resumen de 1-2 frases para vista previa",
  "content": "Contenido HTML completo del artículo con <h2>, <h3>, <p>, <ul>, <li>"
}`;

export default async function handler(req: Request) {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    try {
        const { topic, category = 'Consejos', wordCount = 800 } = await req.json();

        if (!topic || topic.trim().length < 5) {
            return new Response(JSON.stringify({
                error: 'El tema debe tener al menos 5 caracteres'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

        if (!LOVABLE_API_KEY) {
            throw new Error('LOVABLE_API_KEY no está configurada');
        }

        const userPrompt = `Genera un artículo de blog sobre el siguiente tema: "${topic}"

Categoría: ${category}
Extensión aproximada: ${wordCount} palabras

El artículo debe ser informativo, útil para dueños de mascotas, y optimizado para SEO.
Responde SOLO con el JSON, sin texto adicional.`;

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.7,
                max_tokens: 3000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del gateway de IA:', response.status, errorText);

            if (response.status === 429) {
                return new Response(JSON.stringify({
                    error: 'Límite de solicitudes alcanzado. Intenta en unos minutos.'
                }), {
                    status: 429,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }

            return new Response(JSON.stringify({ error: 'Error al generar contenido' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const aiResponse = await response.json();
        const content = aiResponse.choices?.[0]?.message?.content;

        if (!content) {
            return new Response(JSON.stringify({ error: 'No se generó contenido' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        let blogData;
        try {
            let jsonContent = content;
            if (content.includes('```json')) {
                jsonContent = content.replace(/```json\n?/g, '').replace(/```/g, '');
            }
            blogData = JSON.parse(jsonContent.trim());
        } catch {
            console.error('Error parsing AI response:', content);
            return new Response(JSON.stringify({
                error: 'Error al procesar la respuesta de IA'
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        const slug = blogData.title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        return new Response(JSON.stringify({
            success: true,
            data: {
                title: blogData.title,
                slug,
                excerpt: blogData.excerpt,
                content: blogData.content,
                category,
            },
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error en generate-blog-post:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Error desconocido'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
}
